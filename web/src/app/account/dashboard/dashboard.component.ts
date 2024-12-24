// System Utils
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';
import { Title } from '@angular/platform-browser';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

// Configuration
@Component({
  selector: 'app-dashboard',
  imports: [
    AccountLayoutComponent,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

// Logic
export class DashboardComponent implements OnInit {

  // SideNav mark
  showSideNav = false;

  // Current user holder
  currentUser: User | null = null;

  constructor(
    private title: Title,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('dashboard').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Get User's Data
    this.userService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });

  }

}
