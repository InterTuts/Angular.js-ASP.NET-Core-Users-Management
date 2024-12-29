// System Utils
import { Component, OnInit } from '@angular/core';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';

// Configuration
@Component({
  selector: 'app-transactions',
  imports: [
    AccountLayoutComponent,
    TranslateModule
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})

// Logic
export class TransactionsComponent {

  constructor(
    private title: Title,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('transactions').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

  }

}
