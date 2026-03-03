import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EmployeeService } from '../../../services/employee';
import { ImageUploadService } from '../../../services/image-upload';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-employee.html',
  styleUrls: ['./add-employee.css']
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;

  loading = false;
  errorMsg = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private imageUploadService: ImageUploadService
  ) {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required]],
      department: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get fullName() { return this.employeeForm.get('fullName'); }
  get position() { return this.employeeForm.get('position'); }
  get department() { return this.employeeForm.get('department'); }
  get email() { return this.employeeForm.get('email'); }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  private withTimeout<T>(p: Promise<T>, ms = 15000): Promise<T> {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('Request timed out (15s).')), ms);
      p.then((v) => { clearTimeout(t); resolve(v); })
       .catch((e) => { clearTimeout(t); reject(e); });
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMsg = '';

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.errorMsg = 'Profile picture is required.';
      return;
    }

    this.loading = true;

    try {
      // 1) Upload image to Cloudinary (timeout so it can’t hang forever)
      const imageUrl = await this.withTimeout(
        this.imageUploadService.uploadImage(this.selectedFile),
        15000
      );

      // 2) Create employee via GraphQL (timeout so it can’t hang forever)
      await this.withTimeout(
        this.employeeService.add({
          fullName: this.fullName?.value,
          position: this.position?.value,
          department: this.department?.value,
          email: this.email?.value,
          profileImage: imageUrl,
        }),
        15000
      );

      this.router.navigate(['/employees']);
    } catch (err: any) {
      console.error('Add employee failed:', err);

      // Apollo errors often hide the real message in graphQLErrors
      const gqlMsg =
        err?.graphQLErrors?.[0]?.message ||
        err?.networkError?.message ||
        err?.message;

      this.errorMsg = gqlMsg || 'Failed to add employee. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}