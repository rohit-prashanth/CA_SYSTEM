// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface CheckUserResponse {
  valid: boolean;
  message: string;
  user?: {
    rowId: number;
    email: string;
    loginId: string;
    fullName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private validateUrl = `${environment.apiBaseUrl}/api/requests/check-user/`;

  private SESSION_KEY_EMAIL = 'email';
  private SESSION_KEY_LOGIN_ID = 'loginId';
  private SESSION_KEY_FULL_NAME = 'fullName';
  private SESSION_KEY_ROW_ID = 'rowId';

  email: string | null = null;
  loginId: string | null = null;
  fullName: string | null = null;
  rowId: number | null = null;
    
  constructor(private http: HttpClient) {}

  validateUser(email: string, loginId: string) {
    return this.http.post<CheckUserResponse>(this.validateUrl, { email, loginId });
  }

  setSession(email: string, loginId: string, fullName: string, rowId: number) {
    this.email = email;
    this.loginId = loginId;
    this.fullName = fullName;
    this.rowId = rowId;

    sessionStorage.setItem(this.SESSION_KEY_EMAIL, email);
    sessionStorage.setItem(this.SESSION_KEY_LOGIN_ID, loginId);
    sessionStorage.setItem(this.SESSION_KEY_FULL_NAME, fullName);
    sessionStorage.setItem(this.SESSION_KEY_ROW_ID, rowId.toString());

    console.log('🔐 Session stored:', { email, loginId, fullName, rowId });
  }

  loadSession() {
    this.email = sessionStorage.getItem(this.SESSION_KEY_EMAIL);
    this.loginId = sessionStorage.getItem(this.SESSION_KEY_LOGIN_ID);
    this.fullName = sessionStorage.getItem(this.SESSION_KEY_FULL_NAME);
    const rowId = sessionStorage.getItem(this.SESSION_KEY_ROW_ID);
    this.rowId = rowId ? Number(rowId) : null;

    console.log('📦 Session loaded:', { 
      email: this.email, 
      loginId: this.loginId, 
      fullName: this.fullName, 
      rowId: this.rowId 
    });
  }

  clearSession() {
    this.email = null;
    this.loginId = null;
    this.fullName = null;
    this.rowId = null;

    sessionStorage.removeItem(this.SESSION_KEY_EMAIL);
    sessionStorage.removeItem(this.SESSION_KEY_LOGIN_ID);
    sessionStorage.removeItem(this.SESSION_KEY_FULL_NAME);
    sessionStorage.removeItem(this.SESSION_KEY_ROW_ID);

    console.log('🧹 Session cleared');
  }
}
