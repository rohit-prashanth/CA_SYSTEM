import { Component } from '@angular/core';
import { Dashboard } from '../dashboard/dashboard';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [ RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  isCollapsed = false;

  constructor(private router: Router) {
    // Inject Router here
    // Listen for route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true; // Collapse sidebar on every route
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
