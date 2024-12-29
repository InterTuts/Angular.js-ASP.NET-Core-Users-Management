// System Utils
import { Component, OnInit } from '@angular/core';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';

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

  constructor(
    private title: Title,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('dashboard').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

  }

}
