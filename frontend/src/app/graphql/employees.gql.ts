import { gql } from 'apollo-angular';

/* =========================
   GET LIST (with search)
========================= */
export const GET_EMPLOYEES = gql`
  query GetEmployees($search: String) {
    employees(search: $search) {
      _id
      fullName
      email
      position
      department
      profileImage
    }
  }
`;

/* =========================
   GET SINGLE
========================= */
export const GET_EMPLOYEE_BY_ID = gql`
  query GetEmployeeById($id: ID!) {
    employee(id: $id) {
      _id
      fullName
      email
      position
      department
      profileImage
    }
  }
`;

/* =========================
   ADD
========================= */
export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      _id
      fullName
      email
      position
      department
      profileImage
    }
  }
`;

/* =========================
   UPDATE  (✅ FIXED HERE)
========================= */
export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
      _id
      fullName
      email
      position
      department
      profileImage
    }
  }
`;

/* =========================
   DELETE
========================= */
export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;