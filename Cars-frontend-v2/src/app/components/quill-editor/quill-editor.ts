import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../services/request';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarStateService } from '../../shared-services/sidebar-state.service';
import { AuthService } from '../../services/auth';

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
  @Input() sectionName!: string | null;
  @Input() canEdit: boolean = false;

  public user_id: number | null = null;

  content: string = '<p>Start typing...</p>';
  filename: string = 'test';
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  private quill: any; // Quill instance

  constructor(
    private requestService: RequestService,
    private snackBar: MatSnackBar,
    private router: Router,
    private sidebarState: SidebarStateService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.user_id = this.authService.rowId;
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

      if (this.quill) {
        const delta = this.quill.clipboard.convert(normalized);
        this.quill.setContents(delta, 'silent');
        this.ensureTrailingBlankLine();
        this.moveCursorToEnd();
      }
    });
  }

  // Quill editor instance hook
  onEditorCreated(quill: any) {
    this.quill = quill;

    // Set editor to read-only if not allowed
    this.quill.enable(this.canEdit);

    // If content was already loaded
    if (this.content) {
      const delta = this.quill.clipboard.convert(this.content);
      this.quill.setContents(delta, 'silent');
      this.ensureTrailingBlankLine();
      this.moveCursorToEnd();
    }
  }

  private normalizeImportedHtml(html: string): string {
    html = html.replace(/<!--[\s\S]*?-->/g, '').trim();

    // Images wrapper
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
    if (!this.quill) return;

    // Get full HTML including colors, background, code blocks
    const html = this.quill.root.innerHTML;

    this.requestService
      .exportDocument(this.user_id, this.sectionName, this.filename, html)
      .subscribe({
        next: (res) => {
          this.snackBar.open('Document saved successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success'],
          });
        },
        error: (err) => {
          // Use backend message if present
          const message = err?.error?.message || 'Failed to save document!';
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error'],
          });
        },
      });
  }

  cancelDoc() {
    const id = this.requestId ? Number(this.requestId) : null;
    if (id !== null) {
      this.sidebarState.resetSidebar(id); // ✅ now it's a number
      this.router.navigate(['/view-request', 'requests', id]);
    }
  }
}
