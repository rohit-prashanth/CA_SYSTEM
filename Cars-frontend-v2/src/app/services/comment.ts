import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Comment {
  id?: string;
  post_id: string;
  user_id: string;
  text: string;
  parent?: string | null; // 👈 make optional
  created_at?: string;
  updated_at?: string;
  replies?: Comment[];
  likes?: string[]; // array of user_ids who liked
  dislikes?: string[]; // array of user_ids who disliked
}

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = `${environment.apiBaseUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  getComments(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments/`);
  }

  //   addComment1(postId: string, comment: Comment): Observable<Comment> {
  //     return this.http.post<Comment>(
  //       `${this.apiUrl}/posts/${postId}/comments/`,
  //       comment
  //     );
  //   }

  addComment(
    postId: string,
    comment: Comment,
    parentId?: string
  ): Observable<Comment> {
    if (parentId) {
      comment.parent = parentId;
    }
    return this.http.post<Comment>(
      `${this.apiUrl}/posts/${postId}/comments/`,
      comment
    );
  }

  updateComment(
    commentId: string,
    comment: Partial<Comment>
  ): Observable<Comment> {
    return this.http.put<Comment>(
      `${this.apiUrl}/comments/${commentId}/`,
      comment
    );
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}/`);
  }

   /** Like a comment */
  likeComment(commentId: string, userId: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments/${commentId}/like/`, {
      user_id: userId,
    });
  }

  /** Dislike a comment */
  dislikeComment(commentId: string, userId: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments/${commentId}/dislike/`, {
      user_id: userId,
    });
  }
}
