import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  imports: [
    QuillEditorComponent,
    FormsModule,
    CommonModule,
    MatSnackBarModule,
    RouterOutlet,
  ],
  templateUrl: './quill-editor.html',
  styleUrls: ['./quill-editor.css'],
})
export class QuillEditor implements OnInit, OnChanges {
  @Input() requestId!: string | null;
  @Input() sectionId!: string | null;
  @Input() subsectionId!: string | null;

  content: string = '<p>Start typing...</p>';
  filename: string = 'test';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  private quill: any; // will hold Quill instance

  constructor(
    private requestService: RequestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadDocument();
  }

 ngOnChanges(changes: SimpleChanges) {
  if (
    (changes['requestId'] && !changes['requestId'].firstChange) ||
    (changes['sectionId'] && !changes['sectionId'].firstChange) ||
    (changes['subsectionId'] && !changes['subsectionId'].firstChange)
  ) {
    this.loadDocument();
  }
}


  private loadDocument() {
    if (!this.requestId || !this.sectionId || !this.subsectionId) return;

    this.filename = `r${this.requestId}s${this.sectionId}sub${this.subsectionId}`;

    this.requestService.importDocument(this.filename).subscribe((res) => {
      const normalized = this.normalizeImportedHtml(res.html);
      this.content = normalized;
      this.filename = res.filename;

      // If editor is already initialized, push normalized HTML directly
      if (this.quill) {
        const delta = this.quill.clipboard.convert({ html: normalized });
        this.quill.setContents(delta, 'silent');
        this.ensureTrailingBlankLine();
        this.moveCursorToEnd();
      }
    });
  }

  // 🔹 Hook to get Quill instance
  onEditorCreated(quill: any) {
    this.quill = quill;
    // If content was already loaded before quill initialized
    if (this.content) {
      const delta = this.quill.clipboard.convert({ html: this.content });
      this.quill.setContents(delta, 'silent');
      this.ensureTrailingBlankLine();
      this.moveCursorToEnd();
    }
  }

  private normalizeImportedHtml(html: string): string {
    html = html.replace(/<!--[\s\S]*?-->/g, '').trim();

    html = html.replace(
      /<img([^>]*)src="([^"]+)"([^>]*)>/gi,
      (match, before, src, after) => {
        let width = 320;
        let height = 180;

        const widthAttr = /width\s*=\s*["']?(\d+)/i.exec(before + after);
        const heightAttr = /height\s*=\s*["']?(\d+)/i.exec(before + after);
        if (widthAttr) width = parseInt(widthAttr[1], 10);
        if (heightAttr) height = parseInt(heightAttr[1], 10);

        const styleAttr = /style=["']([^"']+)["']/i.exec(before + after);
        if (styleAttr) {
          const style = styleAttr[1];
          const styleWidth = /width\s*:\s*(\d+)px/i.exec(style);
          const styleHeight = /height\s*:\s*(\d+)px/i.exec(style);
          if (styleWidth) width = parseInt(styleWidth[1], 10);
          if (styleHeight) height = parseInt(styleHeight[1], 10);
        }

        return `
          <div class="resizable-image-wrapper"
               style="display:inline-block;resize:both;overflow:hidden;
                      max-width:100%;border:1px dashed #ccc;position:relative;
                      width:${width}px;height:${height}px">
            <img src="${src}"
                 style="width:100%;height:100%;display:block;pointer-events:none;" />
          </div>
        `;
      }
    );

    if (!/(<\/p>|<\/div>|<\/br>|<\/table>|<\/ul>|<\/ol>)\s*$/i.test(html)) {
      html += '<p><br></p>';
    } else {
      html += '<p><br></p>';
    }

    return html;
  }

  private ensureTrailingBlankLine() {
    if (!this.quill) return;
    const len = this.quill.getLength();
    const lastLine = this.quill.getLine(len - 2);
    if (!lastLine || lastLine.length === 0) {
      this.quill.insertText(len - 1, '\n', 'silent');
    }
  }

  private moveCursorToEnd() {
    if (!this.quill) return;
    const len = this.quill.getLength();
    this.quill.setSelection(len - 1, 0, 'silent');
  }

  saveDoc() {
    this.requestService.exportDocument(this.filename, this.content).subscribe({
      next: () => {
        this.snackBar.open('Document saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success'],
        });
      },
      error: () => {
        this.snackBar.open('Failed to save document!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  // cancelDoc() {
  //   const dialogRef = this.dialog.open(ConfirmDialog, {
  //     width: '400px',
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.documentEditor.documentEditor.openBlank();
  //     }
  //   });
  // }
}


