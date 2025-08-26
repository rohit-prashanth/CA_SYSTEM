import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RequestService } from '../../services/request';
import { DocumentEditor } from '../document-editor/document-editor';
import { QuillEditor } from '../quill-editor/quill-editor';

@Component({
  selector: 'app-subsection-detail',
  standalone: true,
  imports: [CommonModule, DocumentEditor, QuillEditor],
  // template: `
  //   <div *ngIf="loading">Loading...</div>
  //   <div *ngIf="error" class="error">{{ error }}</div>
  //   <div *ngIf="data">
  //     <h3>Subsection {{ currentSubsectionId }}</h3>
  //     <pre>{{ data | json }}</pre>
  //   </div>
  // `,
  templateUrl: './subsection-detail.html',
  styleUrls: ['./subsection-detail.css'],
})
export class SubsectionDetail implements OnInit, OnDestroy {
  data: any = null;
  loading = false;
  error: string | null = null;
  currentRequestId: string | null = null;
  currentSectionId: string | null = null;
  currentSubsectionId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const requestId = params.get('requestId');
      const sectionId = params.get('sectionId');
      const subsectionId = params.get('subsectionId');
      // if (subsectionId) {
      //   this.fetchSubSection(subsectionId);
      // }
      this.currentRequestId = requestId;
      this.currentSectionId = sectionId;
      this.currentSubsectionId = subsectionId;
    });
  }

  private fetchSubSection(id: string) {
    console.log('Fetching subsection:', id);
    this.currentSubsectionId = id;
    this.loading = true;
    this.error = null;
    this.data = null;

    this.requestService.getSubSectionDetail(id).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load subsection data';
        this.loading = false;
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
