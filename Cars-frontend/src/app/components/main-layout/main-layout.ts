import { Component } from '@angular/core';
import { Dashboard } from "../dashboard/dashboard";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Dashboard, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
