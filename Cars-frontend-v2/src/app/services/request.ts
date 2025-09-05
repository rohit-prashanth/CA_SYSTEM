// src/app/services/request.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private requestapiUrl = `${environment.apiBaseUrl}/api/requests`;

  constructor(private http: HttpClient) {}

  submitCCBRequests(data: any): Observable<any> {
    return this.http.post(`${this.requestapiUrl}/ccb-requests/`, data);
  }

  getCCBRequests(aid?: string | number): Observable<any> {
    let url = `${this.requestapiUrl}/ccb-requests/`;

    if (aid) {
      url += `${aid}/`; // or `?aid=${aid}` if it's a query param
    }

    return this.http.get(url);
  }

  // Get request friendly name
  getRequestName(requestId: string): Observable<string> {
    return this.http
      .get<{ name: string }>(`${this.requestapiUrl}/${requestId}/name/`)
      .pipe(map((res) => res.name));
  }

  // // Get section › subsection friendly name
  // getSectionOrSubsectionName(sectionId: string, subsectionId: string): Observable<string> {
  //   return this.http.get<{ name: string }>(
  //     `${this.requestapiUrl}/sections/${sectionId}/subsections/${subsectionId}/name/`
  //   ).pipe(map(res => res.name));
  // }
  getSectionOrSubsectionName(
    sectionId: string,
    subsectionId: string
  ): Observable<{ section: string; subsection: string }> {
    return this.http.get<{ section: string; subsection: string }>(
      `${this.requestapiUrl}/sections/${sectionId}/subsections/${subsectionId}/name/`
    );
  }

  getItVerticals(): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/it-verticals/`);
  }

  getSBUs(): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/sbus/`);
  }

  getCCBScopes(): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/ccb-scopes/`);
  }

  getCCBClassification(): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/ccb-classification/`);
  }

  getSubSectionDetail(id: string): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/ccb-requests/${id}/`);
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.requestapiUrl}/ccb-docx/`, formData);
  }

  readDocument(): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/ccb-docx/`, {
      responseType: 'blob',
    });
  }

  importDocument(filename: string): Observable<any> {
    return this.http.get(`${this.requestapiUrl}/import/${filename}/`);
  }

  exportDocument(
    user_id: number | null,
    sectionName: string | null,
    filename: string,
    html: string
  ): Observable<any> {
    return this.http.post(`${this.requestapiUrl}/export/`, { filename, html, user_id, sectionName });
  }
}
