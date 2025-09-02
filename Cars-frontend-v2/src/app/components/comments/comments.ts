import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommentService, Comment } from '../../services/comment';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommentThread } from '../comment-thread/comment-thread';
import { AttachmentUpload } from '../attachment-upload/attachment-upload';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    CommonModule,
    RouterOutlet,
    CommentThread,
    AttachmentUpload,
  ],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments implements OnInit, OnChanges {
  @Input() requestId!: string | null;
  @Input() sectionId!: string | null;
  @Input() subsectionId!: string | null;
  comments: Comment[] = [];
  newComment = '';
  postId: string = '';
  userId: number | null = null;
  constructor(
    private commentService: CommentService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.rowId;
    console.log(
      'ngOnInit fired:',
      this.requestId,
      this.sectionId,
      this.subsectionId
    );
  }

  ngOnChanges() {
    if (this.requestId && this.sectionId && this.subsectionId) {
      console.log(
        'ngOnChanges fired:',
        this.requestId,
        this.sectionId,
        this.subsectionId
      );
      this.postId = `r${this.requestId}s${this.sectionId}sub${this.subsectionId}`;
      this.loadComments();
    }
  }

  loadComments() {
    if (!this.postId) return; // safe guard

    this.commentService.getComments(this.postId).subscribe((data) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    const comment: Comment = {
      post_id: this.postId,
      user_id: this.userId,
      text: this.newComment,
      parent: null, // 👈 explicitly null for root comments
    };
    this.commentService.addComment(this.postId, comment).subscribe((res) => {
      this.comments.unshift(res);
      this.newComment = '';
    });
    this.loadComments();
  }

  // addComment() {
  //   if (!this.newComment.trim()) return;
  //   const comment: Comment = {
  //     post_id: this.postId,
  //     user_id: 'current_user', // replace with actual user
  //     text: this.newComment,
  //   };
  //   this.commentService.addComment(this.postId, comment).subscribe((res) => {
  //     this.comments.unshift(res);
  //     this.newComment = '';
  //   });
  // }

  deleteComment(id: string) {
    this.commentService.deleteComment(id).subscribe(() => {
      this.comments = this.comments.filter((c) => c.id !== id);
    });
  }
}
