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
import {HomePageComponent} from "./home-page/home-page.component";
import {ProjectsComponent} from "./projects/projects.component";
import {CreateProjectComponent} from "./project-create/create-project.component";
import {ProjectEditComponent} from "./project-edit/project-edit.component";

const guard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.checkLogin().pipe(
    map((authenticated) => {
      if(authenticated)
        return true;

      console.log('Tried to go to a private page while unauthenticated!')

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
  {path: 'home', component: HomePageComponent},

  {path: 'projects', component: ProjectsComponent},
  {path: 'projects/create', component: CreateProjectComponent},
  {path: 'projects/:id/edit', component: ProjectEditComponent}
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
