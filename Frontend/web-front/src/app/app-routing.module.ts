import {inject, Injectable, NgModule} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterModule,
  RouterStateSnapshot,
  Routes
} from '@angular/router';
import {AuthenticationService} from "./services/authentication.service";
import {catchError, map, of} from "rxjs";
import {PublicComponent} from "./public/public.component";
import {SecureComponent} from "./secure/secure.component";
import {SignInComponent} from "./sign-in/sign-in.component";

const guard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.checkLogin().pipe(
    map(() => {
      router.navigate(['../sign-in']).then(success => {
        if (success) {
          // Navigation was successful, do something here
        } else {
          // Navigation failed, handle the error here
        }
      });
      return true
    }),
    catchError(() => {
      console.log('routing ')
      router.navigate(['../sign-in']).then(success => {
        if (success) {
          // Navigation was successful, do something here
        } else {
          // Navigation failed, handle the error here
        }
      });

      return of(false)
    })
  );
};

const PUBLIC_ROUTES: Routes = [
  {path: 'sign-in', component: SignInComponent}
]

const SECURE_ROUTES: Routes = [

]

const APP_ROUTES: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full', },
  {path: '', component: SecureComponent, canActivate: [guard], data: {title: 'Secure Views'}, children: SECURE_ROUTES},
  {path: '', component: PublicComponent, data: {title: 'Public Views'}, children: PUBLIC_ROUTES},
];

@Injectable({
  providedIn: 'root'
})
@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
  }

}
