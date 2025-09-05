import { Component, EventEmitter, Output, OnInit, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AttachmentService } from '../../services/attachments';

export interface Attachment {
  id: string; // maps to _id from Mongo
  fileName: string; // user-chosen name
  filePath: string; // backend relative path (/media/...)
  fileType: string; // MIME type
  uploadedAt: string; // ISO timestamp
}

@Component({
  selector: 'app-attachment-upload',
  imports: [CommonModule, FormsModule],
  templateUrl: './attachment-upload.html',
  styleUrl: './attachment-upload.css',
  standalone: true,
})
export class AttachmentUpload implements OnInit{
  private _postId!: string;

  @Input() set postId(value: string) {
    if (value && value !== this._postId) {
      this._postId = value;
      this.loadAttachments(); // ✅ reload whenever postId changes
    }
  }
  get postId(): string {
    return this._postId;
  }
  
  attachments: Attachment[] = []; // ✅ now typed to match Mongo schema
  pendingFile: File | null = null;
  pendingName: string = '';

  showModal = false;
  modalUrl: SafeResourceUrl | null = null;
  modalType: string | null = null;
  modalTitle: string = '';

  constructor(
    private attachmentService: AttachmentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // this.loadAttachments();
  }

  loadAttachments() {
    this.attachmentService.getAttachments(this.postId).subscribe({
      next: (data) => {
        this.attachments = data.map((doc: any) => ({
          id: doc._id,
          fileName: doc.file_name,
          filePath: this.attachmentService.getAttachmentUrl(doc.file_path),
          fileType: doc.file_type,
          uploadedAt: doc.uploaded_at,
        }));
      },
      error: (err) => console.error('Error loading attachments:', err),
    });
  }

  confirmAdd() {
    if (this.pendingFile && this.pendingName.trim()) {
      this.attachmentService
        .uploadAttachment(this.pendingFile, this.pendingName, this.postId)
        .subscribe({
          next: () => {
            this.pendingFile = null;
            this.pendingName = '';
            this.loadAttachments(); // refresh list
          },
          error: (err) => console.error('Upload failed:', err),
        });
    }
  }

  cancelAdd() {
    this.pendingFile = null;
    this.pendingName = '';
  }



  openPreview(file: Attachment) {
    console.log(file.filePath)
    this.modalTitle = file.fileName;
    const ext = file.filePath.split('.').pop()?.toLowerCase();

    if (['png', 'jpg', 'jpeg', 'gif'].includes(ext!)) {
      this.modalType = 'image';
      this.modalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        file.filePath
      );
      this.showModal = true;
    } else if (ext === 'pdf') {
      this.modalType = 'pdf';
      this.modalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        file.filePath
      );
      // + '#toolbar=0'
      this.showModal = true;
    } else if (['docx', 'xlsx', 'pptx'].includes(ext!)) {
      // Instead of preview → trigger download
      const link = document.createElement('a');
      link.href = file.filePath;
      link.download = file.fileName; // suggests filename
      link.click();
      this.showModal = false; // no modal for office docs
    } else {
      this.modalType = 'other';
      this.modalUrl = null;
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
    this.modalUrl = null;
    this.modalType = null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pendingFile = input.files[0]; // store selected file
      this.pendingName = this.pendingFile.name.split('.')[0];
      // default pendingName = file name without extension
    }
  }
}
