import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
  ActivatedRoute,
} from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Breadcrumb } from "../breadcrumb/breadcrumb";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, Breadcrumb],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  isCollapsed = false;
  loading = true; // show loader while validating

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Collapse sidebar automatically on navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
      }
    });
  }

  ngOnInit() {
    this.checkUser();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  checkUser() {
    // 🔹 1. First, check if query params are passed from App1
    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      const loginId = params['loginId'];

      console.log('email:', email);
      console.log('loginId:', loginId);

      if (email && loginId) {
        // Store in session & validate with backend
        this.validateAndStore(email, loginId);
      } else {
        // 🔹 2. If no params, check existing session
        this.authService.loadSession();
        if (this.authService.email && this.authService.loginId) {
          this.validateAndStore(
            this.authService.email,
            this.authService.loginId
          );
        } else {
          // 🔹 3. No params & no session → error
          this.router.navigate(['/login-error']);
        }
      }
    });
  }

  private validateAndStore(email: string, loginId: string) {
    this.authService.validateUser(email, loginId).subscribe({
      next: (res) => {
        console.log('inside validate&store', res);

        if (res.valid && res.user) {
          console.log('✅ User validated:', res.user);

          this.authService.setSession(
            res.user.email,
            res.user.loginId,
            res.user.fullName,
            res.user.rowId,
            res.user.roles
          );

          this.loading = false; // hide loader
          // optionally redirect to dashboard
          // this.router.navigate(['/dashboard']);
        } else {
          console.warn('❌ Invalid user, redirecting...');
          this.authService.clearSession();
          this.router.navigate(['/login-error']);
        }
      },
      error: (err) => {
        console.error('❌ API error:', err);
        this.authService.clearSession();
        this.router.navigate(['/login-error']);
      },
    });
  }
}
