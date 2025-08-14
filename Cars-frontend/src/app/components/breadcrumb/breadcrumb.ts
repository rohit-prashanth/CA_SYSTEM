import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav *ngIf="breadcrumbs.length" class="breadcrumb">
      <ng-container *ngFor="let breadcrumb of breadcrumbs; let last = last">
        <a *ngIf="!last" [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
        <span *ngIf="last">{{ breadcrumb.label }}</span>
        <span *ngIf="!last"> / </span>
      </ng-container>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      padding: 8px 0;
      font-size: 14px;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class Breadcrumb {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      let label = child.snapshot.data['breadcrumb'];
      if (label) {
        // Replace params like :requestId with actual value
        Object.keys(child.snapshot.params).forEach(param => {
          label = label.replace(`:${param}`, child.snapshot.params[param]);
        });

        breadcrumbs.push({ label, url });
      }

      return this.buildBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}



// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';

// interface BreadcrumbItem {
//   label: string;
//   url: string;
// }

// @Component({
//   selector: 'app-breadcrumb',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './breadcrumb.html',
//   styleUrls: ['./breadcrumb.css']
// })
// export class Breadcrumb {
//   breadcrumbs: BreadcrumbItem[] = [];

//   constructor(private router: Router, private route: ActivatedRoute) {
//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => {
//         this.breadcrumbs = this.buildBreadcrumb(this.route.root);
//       });
//   }

//   private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
//     const children: ActivatedRoute[] = route.children;

//     if (children.length === 0) {
//       return breadcrumbs;
//     }

//     for (const child of children) {
//       const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
//       if (routeURL !== '') {
//         url += `/${routeURL}`;
//       }

//       let label = child.snapshot.data['breadcrumb'] || routeURL;
//       // Replace params in breadcrumb label
//       Object.keys(child.snapshot.params).forEach(param => {
//         label = label.replace(`:${param}`, child.snapshot.params[param]);
//       });

//       if (label) {
//         breadcrumbs.push({ label, url });
//       }

//       return this.buildBreadcrumb(child, url, breadcrumbs);
//     }

//     return breadcrumbs;
//   }

//   navigateTo(url: string) {
//     this.router.navigateByUrl(url);
//   }
// }




// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { filter } from 'rxjs/operators';

// export interface BreadcrumbItem {
//   label: string;
//   url: string;
// }

// @Component({
//   selector: 'app-breadcrumb',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './breadcrumb.html',
//   styleUrls: ['./breadcrumb.css']
// })
// export class Breadcrumb implements OnInit {
//   breadcrumbs: BreadcrumbItem[] = [];

//   constructor(private router: Router, private route: ActivatedRoute) {}

//   ngOnInit() {
//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe(() => {
//         this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
//       });
//   }

//   private buildBreadcrumbs(
//     route: ActivatedRoute,
//     url: string = '',
//     breadcrumbs: BreadcrumbItem[] = []
//   ): BreadcrumbItem[] {
//     const children: ActivatedRoute[] = route.children;

//     if (children.length === 0) {
//       return breadcrumbs;
//     }

//     for (let child of children) {
//       const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
//       if (routeURL) {
//         url += `/${routeURL}`;
//       }

//       let label = child.snapshot.data['breadcrumb'];
//       if (label) {
//         // Replace params like :id in breadcrumb label with actual values
//         Object.keys(child.snapshot.params).forEach(param => {
//           label = label.replace(`:${param}`, child.snapshot.params[param]);
//         });
//         breadcrumbs.push({ label, url });
//       }

//       return this.buildBreadcrumbs(child, url, breadcrumbs);
//     }

//     return breadcrumbs;
//   }

//   navigateTo(url: string) {
//     this.router.navigateByUrl(url);
//   }
// }




// // // src/app/components/breadcrumb/breadcrumb.ts
// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// // import { filter } from 'rxjs/operators';

// // // @Component({
// // //   selector: 'app-breadcrumb',
// // //   imports: [],
// // //   templateUrl: './breadcrumb.html',
// // //   styleUrl: './breadcrumb.css'
// // // })
// // // export class Breadcrumb {

// // // }

// // export interface BreadcrumbItem {
// //   label: string;
// //   url: string;
// // }

// // @Component({
// //   selector: 'app-breadcrumb',
// //   standalone: true,
// //   imports: [CommonModule],
// //   templateUrl: './breadcrumb.html',
// //   styleUrls: ['./breadcrumb.css'],
// // })
// // export class Breadcrumb implements OnInit {
// //   breadcrumbs: BreadcrumbItem[] = [];

// //   constructor(private router: Router, private route: ActivatedRoute) {}

// //   ngOnInit() {
// //     this.router.events
// //       .pipe(filter((event) => event instanceof NavigationEnd))
// //       .subscribe(() => {
// //         this.breadcrumbs = this.buildBreadcrumbs(this.route.root);
// //       });
// //   }


// //   private buildBreadcrumbs(
// //     route: ActivatedRoute,
// //     url: string = '',
// //     breadcrumbs: BreadcrumbItem[] = []
// //   ): BreadcrumbItem[] {
// //     const children: ActivatedRoute[] = route.children;

// //     if (children.length === 0) {
// //       return breadcrumbs;
// //     }

// //     for (let child of children) {
// //       const routeURL: string = child.snapshot.url
// //         .map((segment) => segment.path)
// //         .join('/');
// //       if (routeURL) {
// //         url += `/${routeURL}`;
// //       }

// //       let label = child.snapshot.data['breadcrumb'];

// //       // Replace params in breadcrumb label (if needed)
// //       Object.keys(child.snapshot.params).forEach((key) => {
// //         label = label?.replace(`:${key}`, child.snapshot.params[key]);
// //       });

// //       if (label) {
// //         breadcrumbs.push({ label, url });
// //       }

// //       // Continue recursion
// //       this.buildBreadcrumbs(child, url, breadcrumbs);
// //     }

// //     return breadcrumbs;
// //   }

// //   navigateTo(url: string) {
// //     this.router.navigateByUrl(url);
// //   }
// // }
