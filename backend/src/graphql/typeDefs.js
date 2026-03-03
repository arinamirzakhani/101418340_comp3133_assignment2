const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  # =========================
  # Assignment 2 Employee Shape
  # =========================
  type Employee {
    _id: ID!
    fullName: String!
    email: String!
    position: String!
    department: String!
    profileImage: String
  }

  input EmployeeInput {
    fullName: String!
    email: String!
    position: String!
    department: String!
    profileImage: String
  }

  # ✅ optional input for updates (better UX + matches real apps)
  input EmployeeUpdateInput {
    fullName: String
    email: String
    position: String
    department: String
    profileImage: String
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

  type Query {
    # ✅ Required by Assignment 2
    employees(search: String): [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthResponse!
    login(usernameOrEmail: String!, password: String!): AuthResponse!

    # ✅ Required by Assignment 2
    addEmployee(input: EmployeeInput!): Employee
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee
    deleteEmployee(id: ID!): Boolean!
  }
`;