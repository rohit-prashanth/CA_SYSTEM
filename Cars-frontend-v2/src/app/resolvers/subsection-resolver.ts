// subsection-resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequestService } from '../services/request';

@Injectable({ providedIn: 'root' })
export class SubsectionResolver implements Resolve<any> {
  constructor(private requestService: RequestService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const requestId = route.paramMap.get('requestId')!;
    const sectionId = route.paramMap.get('sectionId')!;
    const subsectionId = route.paramMap.get('subsectionId')!;

    return this.requestService.getSectionOrSubsectionName(sectionId, subsectionId);
  }
}
