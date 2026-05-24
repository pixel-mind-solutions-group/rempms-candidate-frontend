import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { VerifyEmailComponent } from './views/pages/verify-email/verify-email.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'job-vacancies',
        loadChildren: () =>
          import('./views/job-vacancies/job-vacancies.module').then(
            (m) => m.JobVacanciesModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-jobs',
        loadChildren: () =>
          import('./views/my-jobs/my-jobs.module').then((m) => m.MyJobsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-profiles',
        loadChildren: () =>
          import('./views/my-profiles/my-profiles.module').then(
            (m) => m.MyProfilesModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-preferences',
        loadChildren: () =>
          import('./views/my-preferences/my-preferences.module').then(
            (m) => m.MyPreferencesModule,
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'common-profile',
        loadChildren: () =>
          import(
            './views/my-profiles/common-profile/common-profile.module'
          ).then((m) => m.CommonProfileModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page',
    },
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    data: {
      title: 'Verify Email Page',
    },
  },
  {
    path: 'unauthorized',
    component: Page500Component,
    data: {
      title: 'Unauthorized Page',
    },
  },

  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
