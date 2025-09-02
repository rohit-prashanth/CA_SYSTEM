import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommentService, Comment } from '../../services/comment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-thread',
  standalone: true, // ✅ declare as standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-thread.html',
  styleUrls: ['./comment-thread.css'],
})
export class CommentThread {
  // @Input() comments: Comment[] = [];
  @Input() set comments(value: Comment[]) {
    this._comments = value || [];
    this._comments.forEach((c) => {
      if (this.collapsed[c.id!] === undefined) {
        this.collapsed[c.id!] = true; // start collapsed
      }
    });
  }
  get comments(): Comment[] {
    return this._comments;
  }
  private _comments: Comment[] = [];

  
  @Input() userId!: number | null;
  @Input() postId!: string;
  @Output() refresh = new EventEmitter<void>();

  replyText: { [key: string]: string } = {};
  editingText: { [key: string]: string } = {};
  editing: { [key: string]: boolean } = {};
  replying: { [key: string]: boolean } = {};
  collapsed: { [key: string]: boolean } = {};

  constructor(private commentService: CommentService) {}

  like(comment: Comment) {
   this.commentService.likeComment(comment.id!, this.userId!).subscribe((updated) => {
    comment.likes = updated.likes;
    comment.dislikes = updated.dislikes;
  });
  }

  dislike(comment: Comment) {
    this.commentService.dislikeComment(comment.id!, this.userId!).subscribe((updated) => {
    comment.likes = updated.likes;
    comment.dislikes = updated.dislikes;
  });
  }

  toggleReplies(commentId: string) {
    if (this.collapsed[commentId] === undefined) {
      this.collapsed[commentId] = false;
    } else {
      this.collapsed[commentId] = !this.collapsed[commentId];
    }
  }

  toggleReply(commentId: string) {
    this.replying[commentId] = !this.replying[commentId];
  }

  /** Add reply to a comment */
  addReply(parentId: string) {
    const text = this.replyText[parentId];
    if (!text || !text.trim()) return;

    const reply: Comment = {
      post_id: this.postId,
      user_id: this.userId,
      text,
      parent: parentId,
    };

    this.commentService.addComment(this.postId, reply).subscribe(() => {
      this.refresh.emit();
      this.replyText[parentId] = '';
      this.replying[parentId] = false; // 👈 close reply box after posting
    });
  }

  /** Delete comment */
  deleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    this.commentService.deleteComment(commentId).subscribe(() => {
      this.refresh.emit();
    });
  }

  /** Enable edit mode */
  startEdit(comment: Comment) {
    this.editing[comment.id!] = true;
    this.editingText[comment.id!] = comment.text;
  }

  /** Save edited comment */
  saveEdit(comment: Comment) {
    const newText = this.editingText[comment.id!];
    if (!newText || !newText.trim()) return;

    this.commentService
      .updateComment(comment.id!, { text: newText })
      .subscribe(() => {
        this.refresh.emit();
        this.editing[comment.id!] = false;
      });
  }

  /** Cancel edit */
  cancelEdit(commentId: string) {
    this.editing[commentId] = false;
  }
}
