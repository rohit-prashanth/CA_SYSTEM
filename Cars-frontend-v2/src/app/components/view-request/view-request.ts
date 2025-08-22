import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RequestService } from '../../services/request';
import { RequestItem, Section, staticSections } from './sections.data';
import { filter } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-view-request',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatTooltipModule],
  templateUrl: './view-request.html',
  styleUrls: ['./view-request.css'],
})
export class ViewRequest implements OnInit {
  requests: RequestItem[] = [];
  breadcrumbs: { label: string; url: string }[] = [];
  selectedSubsection: {
    requestId: number;
    sectionId: number;
    subsectionId: number;
  } | null = null;

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

  sidebarCollapsed = false; // Sidebar starts expanded
  // Toggle method
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  fetchRequests() {
    this.requestService.getCCBRequests().subscribe({
      next: (res: any[]) => {
        this.requests = res.map((req) => ({
          id: req.row_id,
          name: req.change_title,
          status: req.change_status,
          expanded: false,
          // map API sections/subsections, adding expanded/active flags for UI
          sections: (req.sections || []).map((section: any) => ({
            id: section.row_id,
            name: section.section_name,
            expanded: false,
            active: false,
            children: (section.subsections || []).map((subsection: any) => ({
              id: subsection.row_id,
              name: subsection.sub_section_name,
              active: false,
              content: subsection.content,
              isActive: subsection.is_active,
            })),
          })),
        }));
        // this.breadcrumbs = this.buildBreadcrumbs();
      },
      error: (err) => {
        console.error('Failed to load requests', err);
      },
    });
  }

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

            if (!newExpanded) {
              // ✅ If collapsing currently active section → clear activeness
              if (sec.active) {
                this.router.navigate(['/view-request', 'requests', request.id]);
                return {
                  ...sec,
                  expanded: false,
                  active: false,
                  children: sec.children.map((sub) => ({
                    ...sub,
                    active: false,
                  })),
                };
              }

              // ✅ If collapsing non-active section → do nothing special
              return {
                ...sec,
                expanded: false,
              };
            }

            // ✅ Expanding
            return {
              ...sec,
              expanded: true,
              // If already another active section exists, don’t make this active
              active: sec.active || false,
            };
          }

          // Collapse other sections, keep their active/subsection state intact
          return {
            ...sec,
            expanded: false,
          };
        }),
      };
    });
  }

  selectSubsection(requestId: number, sectionId: number, subsectionId: number) {
    this.requests = this.requests.map((req) =>
      req.id !== requestId
        ? req
        : {
            ...req,
            sections: req.sections.map((sec) => {
              if (sec.id === sectionId) {
                // ✅ clicked subsection under this section
                return {
                  ...sec,
                  expanded: true,
                  active: true, // parent section active
                  children: sec.children.map((sub) => ({
                    ...sub,
                    active: sub.id === subsectionId,
                  })),
                };
              }

              // ✅ all other sections/subsections → inactive
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

  getStatusIconFileName(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'hourglass.svg';
      case 'UNDER_REVIEW':
        return 'autorenew.svg';
      case 'APPROVED':
        return 'check-circle.svg';
      case 'CANCELLED':
        return 'cancel.svg';
      case 'SUBMITTED':
        return 'check.svg';
      case null:
        return 'help-outline.svg';
      default:
        return 'help-outline.svg';
    }
  }
}
