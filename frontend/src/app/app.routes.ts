import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';

import { EmployeeListComponent } from './pages/employees/employee-list/employee-list';
import { AddEmployeeComponent } from './pages/employees/add-employee/add-employee';
import { EmployeeDetailComponent } from './pages/employees/employee-detail/employee-detail';
import { UpdateEmployeeComponent } from './pages/employees/update-employee/update-employee';

import { AuthGuard } from './guards/auth-guard';
import { PublicGuard } from './guards/public-guard';

import { LayoutComponent } from './shared/components/layout/layout';

export const routes: Routes = [
  // Default app entry
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  { path: 'login', component: LoginComponent, canActivate: [PublicGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [PublicGuard] },

  // Protected routes wrapped by layout (Navbar always visible)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // ✅ IMPORTANT: default page when Layout loads
      { path: '', redirectTo: 'employees', pathMatch: 'full' },

      { path: 'employees', component: EmployeeListComponent },
      { path: 'employees/add', component: AddEmployeeComponent },
      { path: 'employees/:id/edit', component: UpdateEmployeeComponent },
      { path: 'employees/:id', component: EmployeeDetailComponent },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'login' },
];