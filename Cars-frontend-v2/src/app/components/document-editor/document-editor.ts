import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DocumentEditorContainerComponent,
  ToolbarService,
  DocumentEditorContainerModule,
} from '@syncfusion/ej2-angular-documenteditor';

import { RequestService } from '../../services/request';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
// @Component({
//   selector: 'app-document-editor',
//   standalone: true,
//   imports: [DocumentEditorContainerModule], // ✅ Use container module
//   providers: [ToolbarService],
//   template: `
//     <div style="height: 100vh; border: 1px solid #ccc;">
//       <ejs-documenteditorcontainer
//         #documentEditor
//         height="100%"
//         [enableToolbar]="true"
//         style="display:block">
//       </ejs-documenteditorcontainer>
//     </div>
//   `
// })
// export class DocumentEditor {
//   @ViewChild('documentEditor') public documentEditor!: DocumentEditorContainerComponent;

//   // ngOnInit() {
//   //   // Optional: load a DOCX file
//   //   fetch('/assets/sample.docx')
//   //     .then(res => res.blob())
//   //     .then(blob => {
//   //       const reader = new FileReader();
//   //       reader.onload = () => {
//   //         const fileData = reader.result as ArrayBuffer;
//   //         this.documentEditor.documentEditor.open(fileData);
//   //       };
//   //       reader.readAsArrayBuffer(blob);
//   //     });
//   // }
// }

@Component({
  selector: 'app-doc-editor',
  standalone: true,
  imports: [DocumentEditorContainerModule],
  providers: [ToolbarService],
  templateUrl: './document-editor.html',
  styleUrls: ['./document-editor.css'],
})
export class DocumentEditor implements OnInit {
  @ViewChild('documentEditor', { static: true })
  public documentEditor!: DocumentEditorContainerComponent;

  constructor(
    private requestService: RequestService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Load a sample doc on init
    fetch('/assets/sample.docx')
      .then((res) => res.blob())
      .then((blob) => {
        this.documentEditor.documentEditor.open(blob);
      });
  }

  ngAfterViewInit(): void {
    // Hide properties pane
    this.documentEditor.showPropertiesPane = false;

    // Fit page to width
    this.documentEditor.documentEditor.fitPage('FitPageWidth');

    // Set default document options
    this.documentEditor.documentEditor.pageOutline = '#ccc';
    this.documentEditor.documentEditor.acceptTab = true;
    this.documentEditor.documentEditor.isReadOnly = false;
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

  // saveDoc() {
  //   // Save to backend or local
  //   this.documentEditor.documentEditor.save('my-document.docx', 'Docx');
  // }

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

  // cancelDoc() {
  //   const confirmClear = confirm(
  //     'Are you sure you want to clear the document? This cannot be undone.'
  //   );
  //   if (confirmClear) {
  //     this.documentEditor.documentEditor.openBlank();
  //   }
  // }

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

// import { Component, ViewChild } from '@angular/core';
// import {
//   DocumentEditorComponent as SfDocumentEditorComponent,
//   ToolbarService, PrintService, SfdtExportService, WordExportService,
//   SelectionService, SearchService, EditorService, ImageResizerService,
//   TableOptionsDialogService, ContextMenuService, OptionsPaneService,
//   DocumentEditorModule
// } from '@syncfusion/ej2-angular-documenteditor';

// @Component({
//   selector: 'app-document-editor',
//   standalone: true,
//   imports: [DocumentEditorModule], // ✅ include here for the template
//   providers: [
//     ToolbarService, PrintService, SfdtExportService, WordExportService,
//     SelectionService, SearchService, EditorService, ImageResizerService,
//     TableOptionsDialogService, ContextMenuService, OptionsPaneService
//   ],
//   template: `
//     <div style="height: 100vh; border: 1px solid #ccc;">
//       <ejs-documenteditor
//         #documentEditor
//         height="100%"
//         style="display:block"
//         [isReadOnly]="false"
//         [enablePrint]="true"
//         [enableSelection]="true"
//         [enableEditor]="true"
//         [enableSfdtExport]="true"
//         [enableWordExport]="true"
//         [enableOptionsPane]="true"
//         [enableContextMenu]="true"
//         [enableImageResizer]="true"
//         [enableToolbar]="true">
//       </ejs-documenteditor>
//     </div>
//   `
// })
// export class DocumentEditorComponent {
//   @ViewChild('documentEditor') public documentEditor!: SfDocumentEditorComponent;

//   ngOnInit() {
//     fetch('/assets/sample.docx')
//       .then(res => res.blob())
//       .then(blob => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const fileData = reader.result as ArrayBuffer;
//           this.documentEditor.ej2Instances.open(fileData);
//         };
//         reader.readAsArrayBuffer(blob);
//       });
//   }
// }

// import { Component, ViewChild } from '@angular/core';
// import {
//   DocumentEditorComponent as SfDocumentEditorComponent,
//   ToolbarService, PrintService, SfdtExportService, WordExportService,
//   SelectionService, SearchService, EditorService, ImageResizerService,
//   TableOptionsDialogService, ContextMenuService, OptionsPaneService
// } from '@syncfusion/ej2-angular-documenteditor';

// @Component({
//   selector: 'app-document-editor',
//   standalone: true,
//   template: `
//     <div style="height: 100vh; border: 1px solid #ccc;">
//       <ejs-documenteditor
//         #documentEditor
//         height="100%"
//         style="display:block"
//         [isReadOnly]="false"
//         [enablePrint]="true"
//         [enableSelection]="true"
//         [enableEditor]="true"
//         [enableSfdtExport]="true"
//         [enableWordExport]="true"
//         [enableOptionsPane]="true"
//         [enableContextMenu]="true"
//         [enableImageResizer]="true"
//         [enableToolbar]="true">
//       </ejs-documenteditor>
//     </div>
//   `,
//   providers: [
//     ToolbarService, PrintService, SfdtExportService, WordExportService,
//     SelectionService, SearchService, EditorService, ImageResizerService,
//     TableOptionsService, ContextMenuService, OptionsPaneService
//   ]
// })
// export class DocumentEditorComponent {
//   @ViewChild('documentEditor') public documentEditor!: SfDocumentEditorComponent;

//   ngOnInit() {
//     // Load DOCX from assets (optional)
//     fetch('/assets/sample.docx')
//       .then(res => res.blob())
//       .then(blob => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const fileData = reader.result as ArrayBuffer;
//           this.documentEditor.ej2Instances.open(fileData);
//         };
//         reader.readAsArrayBuffer(blob);
//       });
//   }
// }

// import { Component, ViewChild } from '@angular/core';
// import {
//   DocumentEditorComponent as SfDocumentEditorComponent,
//   ToolbarService,
//   PrintService,
//   SfdtExportService,
//   WordExportService,
//   SelectionService,
//   SearchService,
//   EditorService,
//   ImageResizerService,
//   TableOptionsService,
//   ContextMenuService,
//   OptionsPaneService
// } from '@syncfusion/ej2-angular-documenteditor';

// @Component({
//   selector: 'app-document-editor',
//   standalone: true,
//   imports: [SfDocumentEditorComponent],
//   providers: [
//     ToolbarService, PrintService, SfdtExportService, WordExportService,
//     SelectionService, SearchService, EditorService, ImageResizerService,
//     TableOptionsService, ContextMenuService, OptionsPaneService
//   ],
//   template: `
//     <div style="height: 100vh; border: 1px solid #ccc;">
//       <ejs-documenteditor
//         #documentEditor
//         height="100%"
//         style="display:block"
//         [isReadOnly]="false"
//         [enablePrint]="true"
//         [enableSelection]="true"
//         [enableEditor]="true"
//         [enableSfdtExport]="true"
//         [enableWordExport]="true"
//         [enableOptionsPane]="true"
//         [enableContextMenu]="true"
//         [enableImageResizer]="true"
//         [enableToolbar]="true">
//       </ejs-documenteditor>
//     </div>
//   `
// })
// export class DocumentEditorComponent {
//   @ViewChild('documentEditor') public documentEditor!: SfDocumentEditorComponent;

//   ngOnInit() {
//     // Load a DOCX from assets folder (optional)
//     fetch('/assets/sample.docx')
//       .then(res => res.blob())
//       .then(blob => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           const fileData = reader.result as ArrayBuffer;
//           this.documentEditor.ej2Instances.open(fileData);
//         };
//         reader.readAsArrayBuffer(blob);
//       });
//   }
// }
