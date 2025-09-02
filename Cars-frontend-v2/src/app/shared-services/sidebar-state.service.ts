import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
  private resetStateSubject = new Subject<number>();
  resetState$ = this.resetStateSubject.asObservable();

  resetSidebar(requestId: number) {
    this.resetStateSubject.next(requestId);
  }
}
