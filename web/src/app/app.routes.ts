// System Utils
import { Routes } from '@angular/router';

// App Utils
import { AuthGuard } from './shared/guards/auth.guard';
import { SigninComponent } from './auth/signin/signin.component';
import { NotFoundComponent } from './shared/errors/not-found/not-found.component';

export const routes: Routes = [{
  path: '',
  component: SigninComponent,
  canActivate: [AuthGuard]
}, {
  path: 'auth',
  loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
}, {
  path: 'account',
  loadChildren: () => import('./account/account-routing.module').then(m => m.AccountRoutingModule)
}, {
  path: '**',
  component: NotFoundComponent
}];
