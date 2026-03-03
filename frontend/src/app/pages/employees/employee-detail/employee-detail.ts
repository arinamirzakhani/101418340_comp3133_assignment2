import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeService } from '../../../services/employee';
import { Employee } from '../../../models/employee.model';
import { TitlecaseSafePipe } from '../../../pipes/titlecase-safe.pipe';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TitlecaseSafePipe,
  ],
  templateUrl: './employee-detail.html',
  styleUrls: ['./employee-detail.css'],
})
export class EmployeeDetailComponent implements OnInit {
  loading = false;
  errorMsg = '';
  employee: Employee | null = null;

  private employeeId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef // ✅ add this
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'Invalid employee id.';
      this.cdr.detectChanges();
      return;
    }

    this.employeeId = id;
    this.loadEmployee();
  }

  async loadEmployee(): Promise<void> {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges(); // ✅ render "Loading..." immediately

    try {
      this.employee = await this.employeeService.getById(this.employeeId);

      if (!this.employee) {
        this.errorMsg = 'Employee not found.';
      }
    } catch (err: any) {
      console.error('Load employee detail error:', err);
      this.errorMsg = err?.message || 'Failed to load employee details.';
      this.employee = null;
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // ✅ IMPORTANT: show data without needing a click
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  goEdit(): void {
    this.router.navigate(['/employees', this.employeeId, 'edit']);
  }
}