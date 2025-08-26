import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="overlay" *ngIf="loading$ | async">
      <mat-progress-spinner mode="indeterminate" [diameter]="50"></mat-progress-spinner>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.3);
      z-index: 9999;
    }
  `]
})
export class Loader {
  loading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loading$; // ✅ match service property
  }
}
