// System Utils
import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

// Installed Utils
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { debounceTime, Subscription, take, tap } from 'rxjs';

// App Utils
import { AccountLayoutComponent } from '../../shared/layouts/account-layout/account-layout.component';
import { NavigationComponent } from '../../shared/general/navigation/navigation.component';
import { NotificationsDirective } from '../../shared/directives/notifications.directive';
import { ModalService } from '../../shared/services/modal.service';
import { UsersService } from '../../shared/services/users.service';
import ApiResponse from '../../shared/models/api-response.model';
import { UserInfo } from '../../shared/models/user.model';

// Configuration
@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    AccountLayoutComponent,
    NavigationComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

// Logic
export class UsersComponent implements OnInit {

  // Set view container for new user modal view
  @ViewChild('newUser', { static: true, read: ViewContainerRef })
  newUserModal!: ViewContainerRef;
  // Set view container for confirmation user deletion modal view
  @ViewChild('deleteUser', { static: true, read: ViewContainerRef })
  deleteUserModal!: ViewContainerRef;
  @ViewChild('deleteUser') deleteUserRef!: TemplateRef<Element>;

  // New User form
  newUserForm!: FormGroup;

  // User Id Holder for deletion
  userId!: number;

  // Submitting status
  isSubmitting = false;

  // Search form controller
  searchControl: FormControl = new FormControl();

  // Users List Subscription
  usersListSubscription!: Subscription;

  // Users List Container
  usersList: UserInfo[] = [];

  // Users List
  users = {
    searchClass: '',
    total: 0,
    page: 1,
  };

  // Errors messages
  errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  constructor(
    private title: Title,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: object,
    private translateService: TranslateService,
    private modalService: ModalService,
    private usersService: UsersService,
    private notificationsDirective: NotificationsDirective
  ) {}

  ngOnInit(): void {

    // Set Page Title
    this.translateService.get('users').subscribe((pageTitle: string) => {
      this.title.setTitle(pageTitle);
    });

    // Rules
    this.newUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ]),
      ],
    });

    this.usersListSubscription = this.usersService.usersList.subscribe(
      (users) => {
        this.usersList = users?.items ? users.items : [];
        this.users.total = users?.items
          ? users.total
          : users?.items
            ? users.total
            : 0;
        this.users.page = users?.items
          ? users.page
          : users?.items
            ? users.page
            : 0;
        if (this.users.searchClass === 'active') {
          this.users.searchClass = 'complete';
        }
      },
    );

    // Verify if is CSR
    if (isPlatformBrowser(this.platformId)) {

      // Get the users list after component initialization
      this.usersService.getUsers(1, this.searchControl.value);

      // Detect search changes
      this.searchControl.valueChanges
      .pipe(
        tap(() => {
          this.users.searchClass = this.searchControl.value ? 'active' : '';
        }),
        debounceTime(1000),
      )
      .subscribe((searchTerm) => {
        // Prepare the search variables
        this.users.page = 1;

        // Schedule a search
        this.usersService.getUsers(this.users.page, searchTerm);
      });

    }

  };

  onCancelSearch(event: Event) {
    event.preventDefault();
    this.users.searchClass = '';
    this.users.page = 1;
    this.searchControl.setValue('');
  }

  onSubmit(event: Event) {
    event.preventDefault();

    // Reset error messages
    this.errors.firstName = '';
    this.errors.lastName = '';
    this.errors.email = '';
    this.errors.password = '';

    // Get the inputs data
    const firstName = this.newUserForm.get('firstName');
    const lastName = this.newUserForm.get('lastName');
    const email = this.newUserForm.get('email');
    const password = this.newUserForm.get('password');

    // Verify if the received user data is valid
    if (this.newUserForm.valid) {

      // Enable the animation
      this.isSubmitting = true;

      // Create a new user
      const newUserObservable = this.usersService.createUser({
        firstName: firstName?.value,
        lastName: lastName?.value,
        email: email?.value,
        password: password?.value,
      });

      // Subscribe to the newUserObservable
      newUserObservable.pipe(take(1)).subscribe({
        next: (data: ApiResponse<null>) => {
          console.log(data);
          if (data.success) {
            this.notificationsDirective.showNotification(
              'success',
              data.message,
            );
            this.newUserForm.reset();
            this.usersService.getUsers(
              this.users.page,
              this.searchControl.value
            );
          } else {
            this.notificationsDirective.showNotification('error', data.message);
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });

    } else {

      // Check if errors exists for first name
      if (firstName && firstName.errors) {
        // Set error message
        this.errors.firstName = this.translateService.instant(
          'first_name_is_short',
        );
      }

      // Check if errors exists for last name
      if (lastName && lastName.errors) {
        // Set error message
        this.errors.lastName = this.translateService.instant(
          'last_name_is_short',
        );
      }

      // Check if errors exists for email
      if (email && email.errors) {
        // Detect email format error
        this.errors.email =
          typeof email.errors['email'] !== 'undefined'
            ? this.translateService.instant('auth_email_not_valid')
            : '';

        // Detect required error
        this.errors.email =
          typeof email.errors['required'] !== 'undefined'
            ? this.translateService.instant('auth_email_short')
            : this.errors.email;
      }

      // Verify if errors exists for password
      if (password && password.errors) {
        // Detect short password
        this.errors.password =
          typeof password.errors['minlength'] !== 'undefined'
            ? this.translateService.instant('auth_password_short')
            : '';

        // Detect long password
        this.errors.password =
          typeof password.errors['maxlength'] !== 'undefined'
            ? this.translateService.instant('auth_password_long')
            : '';

        // Detect required error
        this.errors.password =
          typeof password.errors['required'] !== 'undefined'
            ? this.translateService.instant('auth_password_short')
            : this.errors.password;
      }
    }
  }

  timestamp_to_date(timestamp: number): string {

    // Turn timestamp into date object
    const date = new Date(timestamp);

    // Extract year, month, and day
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${day}-${month}-${year}`;

  }

  ngOnDestroy(): void {
    this.usersListSubscription.unsubscribe();
  }

  // Events Handlers

  navigateTo(page: number) {
    this.users.page = page;
    this.usersService.getUsers(page, this.searchControl.value);
  }

  onCloseModal() {
    this.modalService.closeModal();
  }

  showModal(modalView: TemplateRef<Element>) {
    this.modalService.showModal(this.newUserModal, modalView);
  }

  exportUsers() {
    this.usersListSubscription = this.usersService.usersList.subscribe(
      (response) => {
        // Verify if the response is successfully
        if (response && response.items && response.items.length !== 0) {
          // Set the list
          let list: [string[]] | null = null;

          // Append to list
          list = [
            [
              '"' + this.translateService.instant('user_id') + '"',
              '"' + this.translateService.instant('first_name') + '"',
              '"' + this.translateService.instant('last_name') + '"',
              '"' + this.translateService.instant('email') + '"',
            ],
          ];

          // Total number of users
          const usersTotal: number = response.items.length;

          // List all numbers
          for (let i = 0; i < usersTotal; i++) {
            // Append to list
            list.push([
              '"' + response.items[i].userId + '"',
              '"' + response.items[i].firstName + '"',
              '"' + response.items[i].lastName + '"',
              '"' + response.items[i].email + '"',
            ]);
          }

          // CSV variable
          let csv: string = '';

          // Prepare the csv
          list!.forEach(function (row) {
            csv += row.join(',');
            csv += '\n';
          });

          // Create the CSV link and download the file
          const csv_link: HTMLAnchorElement = document.createElement('a');

          // Set charset
          csv_link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);

          // Open in new tab the file
          csv_link.target = '_blank';

          // Set the name of the file
          csv_link.download = 'members.csv';

          // Download the CSV
          csv_link.click();
        } else {
          // Show error
          this.notificationsDirective.showNotification(
            'error',
            this.translateService.instant('no_users_were_found'),
          );
        }
      },
    );
  }

  deleteConfirmation(userId: string | number) {
    if (typeof userId === 'number') {
      this.userId = userId;
      this.modalService.showModal(this.deleteUserModal, this.deleteUserRef);
    } else {
      this.notificationsDirective.showNotification(
        'error',
        this.translateService.instant('user_id_not_valid'),
      );
    }
  }

  deleteUserConfirmation() {
    // Try to delete the user
    const deleteUser = this.usersService.deleteUser(this.userId);

    // Subscribe the request
    deleteUser.pipe(take(1)).subscribe({
      next: (data: ApiResponse<null>) => {
        // Check for success response
        if (data.success) {
          // Show notification
          this.notificationsDirective.showNotification('success', data.message);

          // Close the modal
          this.onCloseModal();

          // Check if is the last user in the page
          if (this.usersList.length === 1 && this.users.page > 1) {
            // Decrease the page number
            this.users.page--;
          }

          // Reload the users list
          this.usersService.getUsers(this.users.page, this.searchControl.value);
        } else {
          this.notificationsDirective.showNotification('error', data.message);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

}
