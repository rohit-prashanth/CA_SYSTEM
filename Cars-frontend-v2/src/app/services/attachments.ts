import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private apiUrl = `${environment.apiBaseUrl}/api/comments`; // adjust to your backend
  private baseUrl = `${environment.apiBaseUrl}`; // adjust to your backend

  constructor(private http: HttpClient) {}

  // Upload file
  uploadAttachment(file: File, fileName: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', fileName);
    return this.http.post(`${this.apiUrl}/attachments/upload/`, formData);
  }

  // Get all attachments
  getAttachments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attachments/`);
  }

  // Get single attachment by ID (optional, if you want direct preview link)
  getAttachmentUrl(filePath: string): string {
    console.log(`${this.baseUrl}${filePath}`)
    return `${this.baseUrl}${filePath}`;
  }
}
