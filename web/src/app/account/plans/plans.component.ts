// System Utils
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';
import { NavigationComponent } from '../../shared/general/navigation/navigation.component';

// Configuration
@Component({
  selector: 'app-plans',
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    TranslateModule,
    AccountLayoutComponent,
    NavigationComponent
  ],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})

// Logic
export class PlansComponent {

  constructor(
    private title: Title,
    private translateService: TranslateService,
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('plans').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

  };

}
