export interface Employee {
  _id: string;
  fullName: string;
  email: string;
  position: string;
  department: string;
  profileImage?: string;
}

export interface EmployeeInput {
  fullName: string;
  email: string;
  position: string;
  department: string;
  profileImage?: string;
}