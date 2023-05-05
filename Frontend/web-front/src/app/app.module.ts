import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PageComponent} from './components/page/page.component';
import {GoogleAuthComponent} from './components/google-auth/google-auth.component';
import {GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";
import {HttpClientModule} from "@angular/common/http";
import {SignInComponent} from './components/sign-in/sign-in.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {SecureComponent} from './components/secure/secure.component';
import {PublicComponent} from './components/public/public.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NavBarComponent} from './components/nav-bar/nav-bar.component';
import {ProjectsComponent} from './components/projects/projects.component';
import {ProjectListComponent} from './components/project-list/project-list.component';
import {MyAccountBarComponent} from './components/my-account-bar/my-account-bar.component';
import {CreateProjectComponent} from "./components/project-create/create-project.component";
import {ProjectEditComponent} from './components/project-edit/project-edit.component';
import {ProjectDetailsComponent} from './components/project-details/project-details.component';
import {FunctionalitiesComponent} from './components/functionalities/functionalities.component';
import {FunctionalitiesListComponent} from './components/functionalities-list/functionalities-list.component';
import {FunctionalityCreateComponent} from './components/functionalities-create/functionalities-create.component';
import {FunctionalityUpdateComponent} from './components/functionality-update/functionality-update.component';
import {FunctionalityDetailsComponent} from './components/functionality-details/functionality-details.component';
import {TaskItemListComponent} from './components/task-item-list/task-item-list.component';
import {CreateTaskItemComponent} from "./components/task-item-create/task-item-create.component";
import {ProjectAssociatedAccountList} from './components/project-associated-account-list/project-associated-account-list';
import { TaskItemDetailsComponent } from './components/task-item-details/task-item-details.component';
import { TaskItemEditComponent } from './components/task-item-edit/task-item-edit.component';
import { FunctionalityAssociatedAccountListComponent } from './components/functionality-associated-account-list/functionality-associated-account-list.component';
import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { AccountEditComponent } from './components/account-edit/account-edit.component';
import { AccountCreateComponent } from './components/account-create/account-create.component';
import { AccountTasksComponent } from './components/account-tasks/account-tasks.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    GoogleAuthComponent,
    SignInComponent,
    SignUpComponent,
    HomePageComponent,
    SecureComponent,
    PublicComponent,
    NavBarComponent,
    ProjectsComponent,
    CreateProjectComponent,
    ProjectListComponent,
    MyAccountBarComponent,
    ProjectEditComponent,
    ProjectDetailsComponent,
    FunctionalitiesComponent,
    FunctionalitiesListComponent,
    FunctionalityCreateComponent,
    FunctionalityUpdateComponent,
    FunctionalityDetailsComponent,
    TaskItemListComponent,
    CreateTaskItemComponent,
    ProjectAssociatedAccountList,
    TaskItemDetailsComponent,
    TaskItemEditComponent,
    FunctionalityAssociatedAccountListComponent,
    AccountListComponent,
    AccountsComponent,
    AccountDetailsComponent,
    AccountEditComponent,
    AccountCreateComponent,
    AccountTasksComponent,
    ForbiddenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleSigninButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '934344019711-htpk4uv143hibkpol9vka7fk9qaasq86.apps.googleusercontent.com'
          )
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
