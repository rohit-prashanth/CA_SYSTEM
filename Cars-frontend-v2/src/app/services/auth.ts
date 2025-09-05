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
    roles: {
      roleId: number;
      roleDescription: string;
      sections: {
        row_id: number;
        section_name: string;
      }[];
    }[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private validateUrl = `${environment.apiBaseUrl}/api/requests/check-user/`;

  private SESSION_KEY_EMAIL = 'email';
  private SESSION_KEY_LOGIN_ID = 'loginId';
  private SESSION_KEY_FULL_NAME = 'fullName';
  private SESSION_KEY_ROW_ID = 'rowId';
  private SESSION_KEY_ROLES = 'roles';

  email: string | null = null;
  loginId: string | null = null;
  fullName: string | null = null;
  rowId: number | null = null;
  roles: any[] = [];

  constructor(private http: HttpClient) {}

  validateUser(email: string, loginId: string) {
    return this.http.post<CheckUserResponse>(this.validateUrl, {
      email,
      loginId,
    });
  }

  setSession(
    email: string,
    loginId: string,
    fullName: string,
    rowId: number,
    roles: any[]
  ) {
    this.email = email;
    this.loginId = loginId;
    this.fullName = fullName;
    this.rowId = rowId;
    this.roles = roles;

    sessionStorage.setItem(this.SESSION_KEY_EMAIL, email);
    sessionStorage.setItem(this.SESSION_KEY_LOGIN_ID, loginId);
    sessionStorage.setItem(this.SESSION_KEY_FULL_NAME, fullName);
    sessionStorage.setItem(this.SESSION_KEY_ROW_ID, rowId.toString());
    sessionStorage.setItem(this.SESSION_KEY_ROLES, JSON.stringify(roles));

    console.log('🔐 Session stored:', {
      email,
      loginId,
      fullName,
      rowId,
      roles,
    });
  }

  loadSession() {
    this.email = sessionStorage.getItem(this.SESSION_KEY_EMAIL);
    this.loginId = sessionStorage.getItem(this.SESSION_KEY_LOGIN_ID);
    this.fullName = sessionStorage.getItem(this.SESSION_KEY_FULL_NAME);
    const rowId = sessionStorage.getItem(this.SESSION_KEY_ROW_ID);
    this.rowId = rowId ? Number(rowId) : null;
    this.roles = JSON.parse(
      sessionStorage.getItem(this.SESSION_KEY_ROLES) || '[]'
    );

    console.log('📦 Session loaded:', {
      email: this.email,
      loginId: this.loginId,
      fullName: this.fullName,
      rowId: this.rowId,
      roles: this.roles,
    });
  }

  clearSession() {
    this.email = null;
    this.loginId = null;
    this.fullName = null;
    this.rowId = null;
    this.roles = [];

    sessionStorage.removeItem(this.SESSION_KEY_EMAIL);
    sessionStorage.removeItem(this.SESSION_KEY_LOGIN_ID);
    sessionStorage.removeItem(this.SESSION_KEY_FULL_NAME);
    sessionStorage.removeItem(this.SESSION_KEY_ROW_ID);
    sessionStorage.removeItem(this.SESSION_KEY_ROLES);

    console.log('🧹 Session cleared');
  }

  // 👇 Helpers
  getUserRoles() {
    return this.roles;
  }

  // getUserSections() {
  //   return this.roles.flatMap((role) => role.sections);
  // }

  // auth.service.ts
  getUserSections(): string[] {
    const sessionData = sessionStorage.getItem('roles');
    if (!sessionData) return [];

    const roles = JSON.parse(sessionData);

    // Flatten out all section_name values
    return roles.flatMap((role: any) =>
      role.sections.map((s: any) => s.section_name)
    );
  }

}

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private validateUrl = `${environment.apiBaseUrl}/api/requests/check-user/`;

//   private SESSION_KEY_EMAIL = 'email';
//   private SESSION_KEY_LOGIN_ID = 'loginId';
//   private SESSION_KEY_FULL_NAME = 'fullName';
//   private SESSION_KEY_ROW_ID = 'rowId';
//   private SESSION_KEY_ROLES = 'roles'

//   email: string | null = null;
//   loginId: string | null = null;
//   fullName: string | null = null;
//   rowId: number | null = null;
//   roles: any

//   constructor(private http: HttpClient) {}

//   validateUser(email: string, loginId: string) {
//     return this.http.post<CheckUserResponse>(this.validateUrl, { email, loginId });
//   }

//   setSession(email: string, loginId: string, fullName: string, rowId: number, roles: any) {
//     this.email = email;
//     this.loginId = loginId;
//     this.fullName = fullName;
//     this.rowId = rowId;
//     this.roles = roles

//     sessionStorage.setItem(this.SESSION_KEY_EMAIL, email);
//     sessionStorage.setItem(this.SESSION_KEY_LOGIN_ID, loginId);
//     sessionStorage.setItem(this.SESSION_KEY_FULL_NAME, fullName);
//     sessionStorage.setItem(this.SESSION_KEY_ROW_ID, rowId.toString());

//     // Save roles (with sections) as JSON
//     sessionStorage.setItem(this.SESSION_KEY_ROLES, JSON.stringify(roles));

//     console.log('🔐 Session stored:', { email, loginId, fullName, rowId });
//   }

//   loadSession() {
//     this.email = sessionStorage.getItem(this.SESSION_KEY_EMAIL);
//     this.loginId = sessionStorage.getItem(this.SESSION_KEY_LOGIN_ID);
//     this.fullName = sessionStorage.getItem(this.SESSION_KEY_FULL_NAME);
//     const rowId = sessionStorage.getItem(this.SESSION_KEY_ROW_ID);
//     this.rowId = rowId ? Number(rowId) : null;

//     console.log('📦 Session loaded:', {
//       email: this.email,
//       loginId: this.loginId,
//       fullName: this.fullName,
//       rowId: this.rowId
//     });
//   }

//   clearSession() {
//     this.email = null;
//     this.loginId = null;
//     this.fullName = null;
//     this.rowId = null;

//     sessionStorage.removeItem(this.SESSION_KEY_EMAIL);
//     sessionStorage.removeItem(this.SESSION_KEY_LOGIN_ID);
//     sessionStorage.removeItem(this.SESSION_KEY_FULL_NAME);
//     sessionStorage.removeItem(this.SESSION_KEY_ROW_ID);

//     console.log('🧹 Session cleared');
//   }
// }
