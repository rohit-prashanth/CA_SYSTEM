// request-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../../services/request';

// @Component({
//   selector: 'app-request-detail',
//   imports: [],
//   templateUrl: './request-detail.html',
//   styleUrl: './request-detail.css'
// })
// export class RequestDetail {

// }

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-detail.html',
  styleUrl: './request-detail.css',
  // template: `
  //   <div *ngIf="loading">Loading request details...</div>
  //   <div *ngIf="error" class="error">{{ error }}</div>
  //   <div *ngIf="data">
  //     <h2>Request {{ requestId }}</h2>
  //     <pre>{{ data | json }}</pre>
  //   </div>
  // `,
})
export class RequestDetail implements OnInit {
  requestId!: string;
  data: any;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('requestId');
      if (id) {
        this.requestId = id;
        this.fetchRequestDetail(id);
      }
    });
  }

  private fetchRequestDetail(id: string) {
    this.loading = true;
    this.error = null;
    this.data = null;

    this.requestService.getCCBRequests(id).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load request details';
        this.loading = false;
      },
    });
  }
}
