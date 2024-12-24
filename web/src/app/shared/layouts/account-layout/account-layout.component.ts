// System Utils
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-layout',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    TranslateModule
  ],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.scss'
})
export class AccountLayoutComponent {

  // SideNav mark
  showSideNav = false;

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {}

  getTime(): string {

    // Date object
    const date = new Date();

    // Array of day names
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get the day name
    const dayName = days[date.getDay()];

    // Array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Get the month name
    const monthName = months[date.getMonth()];

    return dayName + ', ' + monthName + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  logOut() {
    this.router.navigate(['/auth/logout']);
  }

}
