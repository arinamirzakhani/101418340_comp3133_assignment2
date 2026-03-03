const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GraphQLError, GraphQLScalarType, Kind } = require("graphql");
const User = require("../models/User");
const EmployeeModel = require("../models/Employee");

const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom Date scalar",
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  },
});

function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError("Unauthorized. Please login first.", {
      extensions: { code: "UNAUTHORIZED" },
    });
  }
}

function formatMongooseError(err) {
  if (err && err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return messages.join(" | ");
  }
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
    return `${field} already exists`;
  }
  return err?.message || "Something went wrong";
}

// Assignment1 Employee doc -> Assignment2 Employee shape
function toA2(empDoc) {
  if (!empDoc) return null;

  const first = empDoc.first_name || "";
  const last = empDoc.last_name || "";
  return {
    _id: empDoc._id.toString(),
    fullName: `${first} ${last}`.trim(),
    email: empDoc.email,
    position: empDoc.designation,
    department: empDoc.department,
    profileImage: empDoc.employee_photo || "",
  };
}

function splitName(fullName) {
  const cleaned = (fullName || "").trim();
  if (!cleaned) return null;
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: "User" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

async function doLogin(usernameOrEmail, password) {
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!user) {
    return { success: false, message: "Invalid credentials", token: null, user: null };
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return { success: false, message: "Invalid credentials", token: null, user: null };
  }

  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return { success: true, message: "Login successful", token, user };
}

function gqlFail(message, code = "BAD_USER_INPUT") {
  throw new GraphQLError(message, { extensions: { code } });
}

module.exports = {
  Date: DateScalar,

  Query: {
    employees: async (_, { search }, context) => {
      requireAuth(context);

      const s = (search || "").trim();
      const filter = {};

      if (s) {
        const re = new RegExp(s, "i");
        filter.$or = [
          { department: re },
          { designation: re },
          { first_name: re },
          { last_name: re },
          { email: re },
        ];
      }

      const docs = await EmployeeModel.find(filter).sort({ created_at: -1 });
      return docs.map(toA2);
    },

    employee: async (_, { id }, context) => {
      requireAuth(context);
      const doc = await EmployeeModel.findById(id);
      return toA2(doc);
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
          return {
            success: false,
            message: "Username or email already exists",
            token: null,
            user: null,
          };
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashed });

        const token = jwt.sign(
          { userId: user._id.toString(), username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "2h" }
        );

        return { success: true, message: "Signup successful", token, user };
      } catch (err) {
        return { success: false, message: formatMongooseError(err), token: null, user: null };
      }
    },

    // ✅ login is Mutation only (matches updated typeDefs)
    login: async (_, { usernameOrEmail, password }) => {
      return doLogin(usernameOrEmail, password);
    },

    addEmployee: async (_, { input }, context) => {
      requireAuth(context);

      try {
        if (!input?.fullName?.trim()) gqlFail("fullName is required");
        if (!input?.email?.trim()) gqlFail("email is required");
        if (!input?.position?.trim()) gqlFail("position is required");
        if (!input?.department?.trim()) gqlFail("department is required");

        const exists = await EmployeeModel.findOne({ email: input.email.trim() });
        if (exists) gqlFail("Employee email already exists", "CONFLICT");

        const nameParts = splitName(input.fullName);
        if (!nameParts) gqlFail("fullName is invalid");

        const doc = await EmployeeModel.create({
          ...nameParts,
          email: input.email.trim(),
          designation: input.position.trim(),
          department: input.department.trim(),
          employee_photo: input.profileImage || "",
          // Required by your Assignment 1 schema
          salary: 1000,
          date_of_joining: new Date(),
          gender: "Other",
        });

        if (!doc) gqlFail("Failed to create employee", "INTERNAL_SERVER_ERROR");
        return toA2(doc);
      } catch (err) {
        gqlFail(formatMongooseError(err), "BAD_USER_INPUT");
      }
    },

    // ✅ matches EmployeeUpdateInput (all optional)
    updateEmployee: async (_, { id, input }, context) => {
      requireAuth(context);

      try {
        if (!id) gqlFail("Employee id is required");

        if (input?.email) {
          const dup = await EmployeeModel.findOne({ email: input.email, _id: { $ne: id } });
          if (dup) gqlFail("Employee email already exists", "CONFLICT");
        }

        const updateDoc = {};

        // Only update fields that exist
        if (input?.fullName !== undefined) {
          const nameParts = splitName(input.fullName);
          if (!nameParts) gqlFail("fullName is invalid");
          updateDoc.first_name = nameParts.first_name;
          updateDoc.last_name = nameParts.last_name;
        }

        if (input?.email !== undefined) updateDoc.email = input.email.trim();
        if (input?.position !== undefined) updateDoc.designation = input.position.trim();
        if (input?.department !== undefined) updateDoc.department = input.department.trim();

        // allow clearing image if empty string
        if (input?.profileImage !== undefined) updateDoc.employee_photo = input.profileImage || "";

        const doc = await EmployeeModel.findByIdAndUpdate(id, updateDoc, {
          new: true,
          runValidators: true,
        });

        if (!doc) gqlFail("Employee not found", "NOT_FOUND");
        return toA2(doc);
      } catch (err) {
        gqlFail(formatMongooseError(err), "BAD_USER_INPUT");
      }
    },

    deleteEmployee: async (_, { id }, context) => {
      requireAuth(context);

      try {
        const deleted = await EmployeeModel.findByIdAndDelete(id);
        return !!deleted;
      } catch (err) {
        gqlFail(formatMongooseError(err), "BAD_USER_INPUT");
      }
    },
  },
};