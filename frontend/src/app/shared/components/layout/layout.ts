import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar'; // ✅ adjust if your navbar path/name differs

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,     // ✅ gives routerLink/routerLinkActive
    RouterOutlet,     // ✅ makes <router-outlet> work reliably in standalone
    NavbarComponent,  // ✅ makes <app-navbar> render
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css'],
})
export class LayoutComponent {}