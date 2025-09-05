import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RequestService } from '../../services/request';
import { DocumentEditor } from '../document-editor/document-editor';
import { QuillEditor } from '../quill-editor/quill-editor';
import { Comments } from '../comments/comments';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-subsection-detail',
  standalone: true,
  imports: [CommonModule, DocumentEditor, QuillEditor, Comments],
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
  sectionName!: string;
  subsectionName!: string;

  canEdit: boolean = false;  // 🔹 controls edit mode


  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService
  ) {}

   ngOnInit() {
    // 🔹 React whenever params change
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.currentRequestId = params.get('requestId');
      this.currentSectionId = params.get('sectionId');
      this.currentSubsectionId = params.get('subsectionId');

      // Always read latest resolved data for section/subsection names
      const data = this.route.snapshot.data['subsectionData'];
      this.sectionName = data?.section ?? null;
      this.subsectionName = data?.subsection ?? null;

      console.log('Section-ngOninit:', this.sectionName);
      console.log('Subsection-ngOninit:', this.subsectionName);

      // 🔹 Check permissions whenever section changes
      this.checkPermissions();
    });
  }

  private checkPermissions() {
    const allowedSections = this.authService.getUserSections();
    console.log('allowedSections', allowedSections)
    this.canEdit =
      !!this.sectionName &&
      allowedSections.includes(this.sectionName.trim());

    console.log('Can Edit:', this.canEdit);
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
