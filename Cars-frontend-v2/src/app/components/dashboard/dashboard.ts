import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router'; // Import Router and NavigationEnd

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  
}





// import { Component } from '@angular/core';
// import { RouterLink, RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [RouterOutlet, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css',
// })
// export class Dashboard {
//   isCollapsed = false;

//   toggleSidebar() {
//     this.isCollapsed = !this.isCollapsed;
//   }
// }
