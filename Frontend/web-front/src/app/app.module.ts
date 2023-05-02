import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { GoogleAuthComponent } from './google-auth/google-auth.component';
import {GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig} from "@abacritt/angularx-social-login";
import {HttpClientModule} from "@angular/common/http";
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SecureComponent } from './secure/secure.component';
import { PublicComponent } from './public/public.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { MyAccountBarComponent } from './my-account-bar/my-account-bar.component';
import {CreateProjectComponent} from "./project-create/create-project.component";
import { ProjectEditComponent } from './project-edit/project-edit.component';

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
