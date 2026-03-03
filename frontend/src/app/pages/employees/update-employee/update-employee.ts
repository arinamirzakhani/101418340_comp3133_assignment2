import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeService } from '../../../services/employee';
import { ImageUploadService } from '../../../services/image-upload';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './update-employee.html',
  styleUrls: ['./update-employee.css'],
})
export class UpdateEmployeeComponent implements OnInit, OnDestroy {
  form: FormGroup;

  loading = false;
  saving = false;
  errorMsg = '';

  employeeId = '';
  employee: Employee | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // track local preview URL so we can revoke it later
  private localPreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private imageUploadService: ImageUploadService,
    private cdr: ChangeDetectorRef // ✅ ADD THIS
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required]],
      department: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get fullName() { return this.form.get('fullName'); }
  get position() { return this.form.get('position'); }
  get department() { return this.form.get('department'); }
  get email() { return this.form.get('email'); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMsg = 'Invalid employee id.';
      this.cdr.detectChanges(); // ✅
      return;
    }
    this.employeeId = id;
    this.loadEmployee();
  }

  ngOnDestroy(): void {
    if (this.localPreviewUrl) URL.revokeObjectURL(this.localPreviewUrl);
  }

  async loadEmployee(): Promise<void> {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges(); // ✅ show "Loading employee..." immediately

    try {
      const emp = await this.employeeService.getById(this.employeeId);

      if (!emp) {
        this.employee = null;
        this.errorMsg = 'Employee not found.';
        return;
      }

      this.employee = emp;

      // Prefill
      this.form.patchValue({
        fullName: emp.fullName,
        position: emp.position,
        department: emp.department,
        email: emp.email,
      });

      this.previewUrl = emp.profileImage || null;

    } catch (err: any) {
      console.error('Load employee error:', err);
      this.errorMsg = err?.message || 'Failed to load employee.';
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // ✅ IMPORTANT: render form immediately
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.selectedFile = file ?? null;

    // clear previous local preview
    if (this.localPreviewUrl) {
      URL.revokeObjectURL(this.localPreviewUrl);
      this.localPreviewUrl = null;
    }

    if (this.selectedFile) {
      this.localPreviewUrl = URL.createObjectURL(this.selectedFile);
      this.previewUrl = this.localPreviewUrl;
    }

    this.cdr.detectChanges(); // ✅ reflect preview instantly
  }

  async onSave(): Promise<void> {
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges(); // ✅
      return;
    }

    this.saving = true;
    this.cdr.detectChanges(); // ✅ show saving state immediately

    try {
      let profileImage = this.employee?.profileImage || '';

      // If user picked a new file, upload it
      if (this.selectedFile) {
        profileImage = await this.imageUploadService.uploadImage(this.selectedFile);
      }

      await this.employeeService.update(this.employeeId, {
        fullName: this.fullName?.value,
        position: this.position?.value,
        department: this.department?.value,
        email: this.email?.value,
        profileImage,
      });

      // Go back to detail page after update
      this.router.navigate(['/employees', this.employeeId]);

    } catch (err: any) {
      console.error('Update employee error:', err);
      this.errorMsg = err?.message || 'Failed to update employee.';
      this.cdr.detectChanges(); // ✅ show error instantly
    } finally {
      this.saving = false;
      this.cdr.detectChanges(); // ✅ stop saving state instantly
    }
  }

  cancel(): void {
    if (this.employeeId) {
      this.router.navigate(['/employees', this.employeeId]);
    } else {
      this.router.navigate(['/employees']);
    }
  }
}