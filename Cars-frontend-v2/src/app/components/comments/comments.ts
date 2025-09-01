import { Component, OnInit } from '@angular/core';
import { CommentService, Comment } from '../../services/comment';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommentThread } from "../comment-thread/comment-thread";
import { AttachmentUpload } from "../attachment-upload/attachment-upload";


@Component({
  selector: 'app-comments',
  imports: [DatePipe, FormsModule, CommonModule, RouterOutlet, CommentThread, AttachmentUpload],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments implements OnInit {
  comments: Comment[] = [];
  newComment = '';
  postId = '123'; // example post ID

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getComments(this.postId).subscribe((data) => {
      this.comments = data;
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    const comment: Comment = {
      post_id: this.postId,
      user_id: 'current_user',
      text: this.newComment,
      parent: null, // 👈 explicitly null for root comments
    };
    this.commentService.addComment(this.postId, comment).subscribe((res) => {
      this.comments.unshift(res);
      this.newComment = '';
    });
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
