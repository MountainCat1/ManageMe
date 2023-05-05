import {inject, Injectable, NgModule} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterModule,
  RouterStateSnapshot,
  Routes
} from '@angular/router';
import {catchError, map, of} from "rxjs";
import {PublicComponent} from "./components/public/public.component";
import {SecureComponent} from "./components/secure/secure.component";
import {SignInComponent} from "./components/sign-in/sign-in.component";
import {HomePageComponent} from "./components/home-page/home-page.component";
import {ProjectsComponent} from "./components/projects/projects.component";
import {CreateProjectComponent} from "./components/project-create/create-project.component";
import {ProjectEditComponent} from "./components/project-edit/project-edit.component";
import {AuthenticationService} from "./services/authentication.service";
import {ProjectDetailsComponent} from "./components/project-details/project-details.component";
import {FunctionalityCreateComponent} from "./components/functionalities-create/functionalities-create.component";
import {FunctionalityUpdateComponent} from "./components/functionality-update/functionality-update.component";
import {FunctionalityDetailsComponent} from "./components/functionality-details/functionality-details.component";
import {CreateTaskItemComponent} from "./components/task-item-create/task-item-create.component";
import {TaskItemDetailsComponent} from "./components/task-item-details/task-item-details.component";
import {TaskItemEditComponent} from "./components/task-item-edit/task-item-edit.component";
import {AccountListComponent} from "./components/account-list/account-list.component";
import {AccountsComponent} from "./components/accounts/accounts.component";
import {AccountDetailsComponent} from "./components/account-details/account-details.component";
import {AccountEditComponent} from "./components/account-edit/account-edit.component";
import {AccountCreateComponent} from "./components/account-create/account-create.component";

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

  {path: 'accounts', component: AccountsComponent},
  {path: 'accounts/create', component: AccountCreateComponent},
  {path: 'accounts/:accountId', component: AccountDetailsComponent},
  {path: 'accounts/:accountId/edit', component: AccountEditComponent},


  {path: 'projects', component: ProjectsComponent},
  {path: 'projects/create', component: CreateProjectComponent},
  {path: 'projects/:projectId', component: ProjectDetailsComponent},
  {path: 'projects/:projectId/edit', component: ProjectEditComponent},

  // {path: 'projects/:projectId/functionalities', component: FunctionalitiesComponent},
  {path: 'projects/:projectId/functionalities/create', component: FunctionalityCreateComponent},
  {path: 'projects/:projectId/functionalities/:functionalityId', component: FunctionalityDetailsComponent},
  {path: 'projects/:projectId/functionalities/:functionalityId/edit', component: FunctionalityUpdateComponent},

  {path: 'projects/:projectId/functionalities/:functionalityId/tasks/create', component: CreateTaskItemComponent},
  {path: 'projects/:projectId/functionalities/:functionalityId/tasks/:taskId', component: TaskItemDetailsComponent},
  {path: 'projects/:projectId/functionalities/:functionalityId/tasks/:taskId/edit', component: TaskItemEditComponent},
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
