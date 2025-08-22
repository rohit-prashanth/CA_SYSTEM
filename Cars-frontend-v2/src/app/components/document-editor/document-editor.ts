import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  DocumentEditorContainerComponent,
  ToolbarService,
  DocumentEditorContainerModule,
} from '@syncfusion/ej2-angular-documenteditor';

import { RequestService } from '../../services/request';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-doc-editor',
  standalone: true,
  imports: [DocumentEditorContainerModule],
  providers: [ToolbarService],
  templateUrl: './document-editor.html',
  styleUrls: ['./document-editor.css'],
})
export class DocumentEditor implements AfterViewInit {
  @ViewChild('documentEditor', { static: true })
  public documentEditor!: DocumentEditorContainerComponent;

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog
  ) {}

  // ngOnInit(): void {
  //   this.loadDocFromApi();
  // }

  // loadDocFromApi(): void {
  //   this.requestService.readDocument().subscribe((blob) => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64String = reader.result as string;
  //       this.documentEditor.documentEditor.open(base64String);
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // }

  ngAfterViewInit(): void {
    this.loadDocFromApi();
  }

  loadDocFromApi() {
    this.requestService.readDocument().subscribe((blob: Blob) => {
      this.requestService.readDocument().subscribe((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const sfdt = reader.result as string;
          this.documentEditor.documentEditor.open(sfdt); // ✅ works without backend
        };
        reader.readAsText(blob); // if file already in SFDT
      });
    });
  }

  openDoc() {
    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.documentEditor.documentEditor.open(file);
      }
    };
    input.click();
  }

  onEditorCreated(): void {
    this.documentEditor.documentEditor.fitPage('FitPageWidth');
    this.documentEditor.documentEditor.pageOutline = '#ccc';
    this.documentEditor.documentEditor.acceptTab = true;
    this.documentEditor.documentEditor.isReadOnly = false;
  }

  saveDoc() {
    // Get the .docx Blob from Syncfusion Editor
    this.documentEditor.documentEditor.saveAsBlob('Docx').then((blob: Blob) => {
      // Prepare form data
      const formData = new FormData();
      formData.append('file', blob, 'my-document.docx');

      // Send to backend via fetch or Angular HttpClient
      this.requestService.uploadDocument(formData).subscribe({
        next: (res) => alert('Document uploaded successfully!'),
        error: (err) => alert('Upload failed: ' + err.message),
      });
    });
  }

  cancelDoc() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.documentEditor.documentEditor.openBlank();
      }
    });
  }

  downloadDoc() {
    this.documentEditor.documentEditor.save('downloaded.docx', 'Docx');
  }
}
