import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { BreadcrumbService } from '../../shared-services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, NgIf, NgFor, AsyncPipe], // 👈 RouterModule gives you routerLink
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.css'],
  // template: `
  //   <!-- <nav
  //     *ngIf="breadcrumbService.breadcrumbs$ | async as breadcrumbs"
  //     class="breadcrumbs"
  //   >
  //     <ng-container *ngFor="let breadcrumb of breadcrumbs; let last = last">
  //       <a *ngIf="!last && breadcrumb.url" [routerLink]="breadcrumb.url">{{
  //         breadcrumb.label
  //       }}</a>
  //       <span *ngIf="!last && !breadcrumb.url">{{ breadcrumb.label }}</span>
  //       <span *ngIf="last">{{ breadcrumb.label }}</span>
  //       <span *ngIf="!last"> ›> </span>
  //     </ng-container>
  //   </nav> -->

  // `,
  // styles: [
  //   `
  //     .breadcrumbs {
  //       font-size: 14px;
  //       margin: 5px 0;
  //     }
  //     a {
  //       text-decoration: none;
  //       color: #0077ffff;
  //     }
  //     span {
  //       color: #666;
  //       padding-left: 5px;
  //     }
  //   `,
  // ],
})
export class Breadcrumb {
  constructor(
    public breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  isCurrentUrl(url?: string): boolean {
    if (!url) return false;
    return this.router.url === url;
  }
}
