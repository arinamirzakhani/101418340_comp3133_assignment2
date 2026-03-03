import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

import {
  ADD_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_EMPLOYEE_BY_ID,
  GET_EMPLOYEES,
  UPDATE_EMPLOYEE,
} from '../graphql/employees.gql';

import { Employee, EmployeeInput } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  async list(search?: string): Promise<Employee[]> {
    const res: any = await firstValueFrom(
      this.apollo.query({
        query: GET_EMPLOYEES,
        variables: { search: search?.trim() || null },
        fetchPolicy: 'no-cache',
      })
    );

    return res?.data?.employees ?? [];
  }

  
  async getById(id: string): Promise<Employee | null> {
    const res: any = await firstValueFrom(
      this.apollo.query({
        query: GET_EMPLOYEE_BY_ID,
        variables: { id },
        fetchPolicy: 'no-cache',
      })
    );

    return res?.data?.employee ?? null;
  }


  async add(input: EmployeeInput): Promise<Employee | null> {
    const res: any = await firstValueFrom(
      this.apollo.mutate({
        mutation: ADD_EMPLOYEE,
        variables: { input },
      })
    );

    // NOTE: adjust field name if your backend uses a different mutation name
    return res?.data?.addEmployee ?? null;
  }

  
  async update(id: string, input: EmployeeInput): Promise<Employee | null> {
    const res: any = await firstValueFrom(
      this.apollo.mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: { id, input },
      })
    );

    // NOTE: adjust field name if your backend uses a different mutation name
    return res?.data?.updateEmployee ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const res: any = await firstValueFrom(
      this.apollo.mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
      })
    );

    // NOTE: adjust field name if your backend returns something else
    return !!res?.data?.deleteEmployee;
  }
}