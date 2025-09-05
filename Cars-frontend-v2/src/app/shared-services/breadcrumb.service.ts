import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { RequestService } from '../services/request';

export interface Breadcrumb {
  label: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private router: Router, private requestService: RequestService) {
    this.breadcrumbs$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      switchMap(() =>
        this.buildBreadcrumbs(this.router.routerState.snapshot.root)
      )
    );
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = ''
  ): Observable<Breadcrumb[]> {
    const children = route.children;
    const child = children[0];

    if (!child) return of([]);

    if (!child.routeConfig) {
      return this.buildBreadcrumbs(child, url);
    }

    const routeURL = child.url.map((seg) => seg.path).join('/');
    if (routeURL) url += `/${routeURL}`;

    const data = child.routeConfig.data || {};
    let label$: Observable<Breadcrumb[]>;

    if (typeof data['breadcrumb'] === 'string') {
      label$ = of([{ label: data['breadcrumb'], url }]);
    } else if (
      data['breadcrumb'] &&
      typeof data['breadcrumb'] === 'object' &&
      'label' in data['breadcrumb']
    ) {
      label$ = of([data['breadcrumb']]);
    } else if (typeof data['breadcrumb'] === 'function') {
      label$ = data['breadcrumb'](child.params, {
        requestService: this.requestService,
      }).pipe(
        map((res: any) => {
          if (Array.isArray(res)) return res; // ✅ already multiple breadcrumbs
          if (typeof res === 'string') return [{ label: res, url }];
          return [res];
        })
      );
    } else {
      label$ = of([]);
    }

    return label$.pipe(
      switchMap((labels) =>
        this.buildBreadcrumbs(child, url).pipe(
          map((childrenBreadcrumbs) => [
            ...labels, // no concat, just spread
            ...childrenBreadcrumbs,
          ])
        )
      )
    );
  }
}

//   private buildBreadcrumbs(
//   route: ActivatedRouteSnapshot,
//   url: string = ''
// ): Observable<Breadcrumb[]> {
//   const children = route.children;
//   const child = children[0];

//   if (!child) return of([]);

//   if (!child.routeConfig) {
//     return this.buildBreadcrumbs(child, url);
//   }

//   const routeURL = child.url.map((seg) => seg.path).join('/');
//   if (routeURL) url += `/${routeURL}`;

//   const data = child.routeConfig.data || {};
//   let label$: Observable<Breadcrumb[]>;

//   if (typeof data['breadcrumb'] === 'string') {
//     label$ = of([{ label: data['breadcrumb'], url }]);
//   } else if (
//     data['breadcrumb'] &&
//     typeof data['breadcrumb'] === 'object' &&
//     'label' in data['breadcrumb']
//   ) {
//     label$ = of([data['breadcrumb']]);
//   } else if (typeof data['breadcrumb'] === 'function') {
//     label$ = data['breadcrumb'](child.params, {
//       requestService: this.requestService,
//     }).pipe(
//       map((res: any) => {
//         if (Array.isArray(res)) return res;
//         if (typeof res === 'string') return [{ label: res, url }];
//         return [res];
//       })
//     );
//   } else {
//     label$ = of([]);
//   }

//   // ✅ If child has no further children → return only its breadcrumb
//   if (!child.children || child.children.length === 0) {
//     return label$;
//   }

//   // ✅ Otherwise merge with deeper breadcrumbs
//   return label$.pipe(
//     switchMap((labels) =>
//       this.buildBreadcrumbs(child, url).pipe(
//         map((childrenBreadcrumbs) => [...labels, ...childrenBreadcrumbs])
//       )
//     )
//   );
// }

// }
//   private buildBreadcrumbs(
//     route: ActivatedRouteSnapshot,
//     url: string = ''
//   ): Observable<Breadcrumb[]> {
//     const children = route.children;
//     if (!children || children.length === 0) return of([]);

//     const child = children[0];
//     if (!child.routeConfig) return this.buildBreadcrumbs(child, url);

//     const routeURL = child.url.map((seg) => seg.path).join('/');
//     if (routeURL) url += `/${routeURL}`;

//     const data = child.routeConfig.data || {};
//     let label$: Observable<Breadcrumb[]>;

//     // if (typeof data['breadcrumb'] === 'string') {
//     //   label$ = of([{ label: data['breadcrumb'], url }]);
//     // } else if (typeof data['breadcrumb'] === 'object') {
//     //   label$ = of([data['breadcrumb']]);
//     if (typeof data['breadcrumb'] === 'string') {
//       // simple string → convert to breadcrumb object
//       label$ = of({ label: data['breadcrumb'], url });
//     } else if (
//       data['breadcrumb'] &&
//       typeof data['breadcrumb'] === 'object' &&
//       'label' in data['breadcrumb']
//     ) {
//       // already a breadcrumb object → use as-is
//       label$ = of(data['breadcrumb']);
//     } else if (typeof data['breadcrumb'] === 'function') {
//       label$ = data['breadcrumb'](child.params, {
//         requestService: this.requestService,
//       }).pipe(
//         map((res: any) => {
//           if (Array.isArray(res)) return res;
//           if (typeof res === 'string') return [{ label: res, url }];
//           return [res];
//         })
//       );
//     } else {
//       label$ = of([]);
//     }

//     return label$.pipe(
//       switchMap((labels) =>
//         this.buildBreadcrumbs(child, url).pipe(
//           map((childrenBreadcrumbs) => [...labels, ...childrenBreadcrumbs])
//         )
//       )
//     );
//   }
// }

// export interface Breadcrumb {
//   label: string;
//   url: string;
// }

// @Injectable({ providedIn: 'root' })
// export class BreadcrumbService {
//   breadcrumbs$: Observable<Breadcrumb[]>;

//   constructor(private router: Router, private requestService: RequestService) {
//     this.breadcrumbs$ = this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd),
//       switchMap(() => this.buildBreadcrumbs(this.router.routerState.snapshot.root))
//     );
//   }

//   private buildBreadcrumbs(
//     route: ActivatedRouteSnapshot,
//     url: string = ''
//   ): Observable<Breadcrumb[]> {
//     const children = route.children;
//     if (!children || children.length === 0) return of([]);

//     const child = children[0];
//     if (!child.routeConfig) return this.buildBreadcrumbs(child, url);

//     const routeURL = child.url.map(seg => seg.path).join('/');
//     if (routeURL) url += `/${routeURL}`;

//     const data = child.routeConfig.data || {};
//     let label$: Observable<string>;

//     if (typeof data['breadcrumb'] === 'string') {
//       let label = data['breadcrumb'];
//       Object.keys(child.params).forEach(k => {
//         label = label.replace(`:${k}`, child.params[k]);
//       });
//       label$ = of(label);
//     } else if (typeof data['breadcrumb'] === 'function') {
//       label$ = data['breadcrumb'](child.params, { requestService: this.requestService });
//     } else {
//       label$ = of('');
//     }

//     return label$.pipe(
//       switchMap(label =>
//         this.buildBreadcrumbs(child, url).pipe(
//           map(childBreadcrumbs => [...(label ? [{ label, url }] : []), ...childBreadcrumbs])
//         )
//       )
//     );
//   }
// }
