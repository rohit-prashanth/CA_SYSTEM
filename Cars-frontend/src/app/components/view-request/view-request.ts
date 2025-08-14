import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../../services/request';
import { RequestItem, Section, staticSections } from './sections.data';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-request',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './view-request.html',
  styleUrls: ['./view-request.css'],
})
export class ViewRequest implements OnInit {
  requests: RequestItem[] = [];
  breadcrumbs: { label: string; url: string }[] = [];

  constructor(
    private http: HttpClient,
    private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchRequests();

    // Build breadcrumbs on navigation
    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.breadcrumbs = this.buildBreadcrumbs();
    //   });
  }

  fetchRequests() {
    this.requestService.getCCBRequests().subscribe({
      next: (res: any[]) => {
        this.requests = res.map((req) => ({
          id: req.row_id,
          name: req.change_title,
          status: req.change_status,
          expanded: false,
          sections: JSON.parse(JSON.stringify(staticSections)),
        }));
        // Rebuild breadcrumbs after data arrives
        // this.breadcrumbs = this.buildBreadcrumbs();
      },
      error: (err) => {
        console.error('Failed to load requests', err);
      },
    });
  }

  // /** 🧩 Build breadcrumb array based on URL params and request/section names */
  // private buildBreadcrumbs(): { label: string; url: string }[] {
  //   const crumbs: { label: string; url: string }[] = [];
  //   const rootUrl = '/view-request';
  //   crumbs.push({ label: 'All Requests', url: rootUrl });

  //   const params = this.route.snapshot.firstChild?.params || {};
  //   const requestId = Number(params['id']);
  //   const sectionId = Number(this.route.snapshot.firstChild?.firstChild?.params['sectionId']);
  //   const subsectionId = Number(
  //     this.route.snapshot.firstChild?.firstChild?.firstChild?.params['subsectionId']
  //   );

  //   // Add request name
  //   if (requestId) {
  //     const req = this.requests.find((r) => r.id === requestId);
  //     if (req) {
  //       crumbs.push({
  //         label: req.name,
  //         url: `${rootUrl}/requests/${req.id}`,
  //       });
  //     }
  //   }

  //   // Add section name
  //   if (requestId && sectionId) {
  //     const req = this.requests.find((r) => r.id === requestId);
  //     const sec = req?.sections.find((s) => s.id === sectionId);
  //     if (sec) {
  //       crumbs.push({
  //         label: sec.name,
  //         url: `${rootUrl}/requests/${requestId}/sections/${sectionId}`,
  //       });
  //     }
  //   }

  //   // Add subsection name
  //   if (requestId && sectionId && subsectionId) {
  //     const req = this.requests.find((r) => r.id === requestId);
  //     const sec = req?.sections.find((s) => s.id === sectionId);
  //     const sub = sec?.children.find((c) => c.id === subsectionId);
  //     if (sub) {
  //       crumbs.push({
  //         label: sub.name,
  //         url: `${rootUrl}/requests/${requestId}/sections/${sectionId}/subsections/${subsectionId}`,
  //       });
  //     }
  //   }

  //   return crumbs;
  // }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  toggleRequest(request: RequestItem) {
    if (request.expanded) {
      this.requests = this.requests.map((req) => {
        if (req.id === request.id) {
          return {
            ...req,
            expanded: false,
            active: false,
            sections: req.sections.map((sec) => ({
              ...sec,
              expanded: false,
              active: false,
            })),
          };
        }
        return req;
      });
      this.router.navigate(['/view-request']);
    } else {
      let newRequests = this.requests.map((req) => ({
        ...req,
        expanded: false,
        active: false,
        sections: req.sections.map((sec) => ({
          ...sec,
          expanded: false,
          active: false,
        })),
      }));

      newRequests = newRequests.map((req) => {
        if (req.id === request.id) {
          return {
            ...req,
            expanded: true,
            active: true,
            sections: req.sections.map((sec) => ({
              ...sec,
              expanded: false,
              active: false,
            })),
          };
        }
        return req;
      });

      this.requests = newRequests;
      this.router.navigate(['/view-request/requests', request.id]);
    }
  }

  toggleSection(request: RequestItem, section: Section) {
    this.requests = this.requests.map((req) => {
      if (req.id !== request.id) return req;

      return {
        ...req,
        sections: req.sections.map((sec) => {
          if (sec.id === section.id) {
            const newExpanded = !sec.expanded;
            return {
              ...sec,
              expanded: newExpanded,
              active: newExpanded,
              children: sec.children.map((sub) => ({
                ...sub,
                active: newExpanded ? sub.active : false,
              })),
            };
          }
          return {
            ...sec,
            expanded: false,
            active: false,
            children: sec.children.map((sub) => ({
              ...sub,
              active: false,
            })),
          };
        }),
      };
    });
  }

  getStatusIconFileName(status: string): string {
    switch (status) {
      case 'DRAFT': return 'hourglass.svg';
      case 'UNDER_REVIEW': return 'autorenew.svg';
      case 'APPROVED': return 'check-circle.svg';
      case 'CANCELLED': return 'cancel.svg';
      case 'SUBMITTED': return 'check.svg';
      case null: return 'help-outline.svg';
      default: return 'help-outline.svg';
    }
  }

  selectSubsection(requestId: number, sectionId: number, subsectionId: number) {
    this.requests = this.requests.map((req) =>
      req.id !== requestId
        ? req
        : {
            ...req,
            sections: req.sections.map((sec) =>
              sec.id !== sectionId
                ? sec
                : {
                    ...sec,
                    children: sec.children.map((sub) => ({
                      ...sub,
                      active: sub.id === subsectionId,
                    })),
                  }
            ),
          }
    );

    this.router.navigate([
      'view-request',
      'requests',
      requestId,
      'sections',
      sectionId,
      'subsections',
      subsectionId,
    ]);
  }
}
