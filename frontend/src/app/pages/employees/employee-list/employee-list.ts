import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { EmployeeService } from '../../../services/employee';
import { Employee } from '../../../models/employee.model';

import { TitlecaseSafePipe } from '../../../pipes/titlecase-safe.pipe';
import { HighlightDirective } from '../../../directives/highlight.directive';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TitlecaseSafePipe,
    HighlightDirective,
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['fullName', 'position', 'department', 'actions'];

  employees: Employee[] = [];
  loading = false;
  errorMsg = '';
  searchText = '';

  private navSub?: Subscription;
  private isLoadingNow = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef // ✅ add this
  ) {}

  ngOnInit(): void {
    this.loadEmployees();

    this.navSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.startsWith('/employees')) {
          this.loadEmployees();
        }
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
  }

  async loadEmployees(): Promise<void> {
    if (this.isLoadingNow) return;
    this.isLoadingNow = true;

    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges(); // ✅ force initial UI update (shows Loading...)

    try {
      const result = await this.employeeService.list(this.searchText);
      this.employees = Array.isArray(result) ? result : [];
    } catch (err: any) {
      console.error('Load employees error:', err);
      this.errorMsg = err?.message || 'Failed to load employees.';
      this.employees = [];
    } finally {
      this.loading = false;
      this.isLoadingNow = false;

      // ✅ THIS is the key: force Angular to render the new employees immediately
      this.cdr.detectChanges();
    }
  }

  onSearch(): void {
    this.loadEmployees();
  }

  clearSearch(): void {
    this.searchText = '';
    this.loadEmployees();
  }

  async deleteEmployee(id: string): Promise<void> {
    const ok = confirm('Are you sure you want to delete this employee?');
    if (!ok) return;

    try {
      await this.employeeService.delete(id);
      await this.loadEmployees();
    } catch (err: any) {
      console.error('Delete employee error:', err);
      this.errorMsg = err?.message || 'Failed to delete employee.';
      this.cdr.detectChanges();
    }
  }
}