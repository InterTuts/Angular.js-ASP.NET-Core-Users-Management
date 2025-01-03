// System Utils
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App Utils
import { AccountGuard } from '../shared/guards/account.guard';
import { NotFoundComponent } from '../shared/errors/not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { PlansComponent } from './plans/plans.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserComponent } from './users/user/user.component';

// Supported Routes
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AccountGuard]
  }, {
    path: 'users',
    component: UsersComponent,
    canActivate: [AccountGuard]
  }, {
    path: 'users/:id',
    component: UserComponent,
    canActivate: [AccountGuard],
  }, {
    path: 'plans',
    component: PlansComponent,
    canActivate: [AccountGuard]
  }, {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AccountGuard]
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

// Configuration
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

// Logic
export class AccountRoutingModule { }
