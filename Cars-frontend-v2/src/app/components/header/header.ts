import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit, OnDestroy {
  currentDateTime: string = '';
  private timer: any;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.updateDateTime();
    // auto-update every second
    this.timer = setInterval(() => this.updateDateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private updateDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 → 12
    const hoursStr = String(hours).padStart(2, '0');

    this.currentDateTime = `${day}-${month}-${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
  }
}
