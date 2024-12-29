// System Utils
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';

// Installed Utils
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// App Utils
import { NotificationsDirective } from '../../directives/notifications.directive';
import { SidebarStatusService } from '../../services/sidebar-status.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-account-layout',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    TranslateModule
  ],
  templateUrl: './account-layout.component.html',
  styleUrl: './account-layout.component.scss'
})
export class AccountLayoutComponent implements OnInit {

  // SideNav mark
  showSideNav = false;

  // Reference for component destroy
  destroyRef = inject(DestroyRef);

  // Current user holder
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private notificationsDirective: NotificationsDirective,
    private sidebarStatusService: SidebarStatusService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Get User's Data
    this.userService.currentUser.subscribe((user) => {

      // Set User
      this.currentUser = user;

      // Verify if options exists
      if ( user?.options && user?.options.length > 0 ) {
        // List the options
        for ( const userInfo of user?.options ) {
          if ( userInfo.optionName === 'Sidebar' ) {
            this.showSideNav = parseInt(userInfo.optionValue)?true:false;
          }
        }
      }

    });

  }

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

  // Maximize or minimize the sidebar in the dashboard
  showHideSidebar() {
    // Change the sidebar status
    this.showSideNav = !this.showSideNav;

    // Change the sidebar status
    const observable = this.sidebarStatusService.changeStatus({
      sidebar: this.showSideNav ? 1 : 0,
    });

    // Subscribe to the changes
    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: { success: boolean; message: string }) => {
        // Verify if the changes weren't saved successfully
        if (!data.success) {
          this.notificationsDirective.showNotification('error', data.message);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  logOut() {
    this.router.navigate(['/auth/logout']);
  }

}
