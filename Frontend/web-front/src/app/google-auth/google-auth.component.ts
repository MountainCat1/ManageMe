import {Component, EventEmitter, Output} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {AuthenticationService} from "../services/authentication.service";
import {AuthViaGoogleRequestContract} from "../contracts/authViaGoogleRequestContract";
import {AuthenticatedEvent} from "./authenticated.event";

@Component({
  selector: 'app-google-auth',
  templateUrl: './google-auth.component.html',
  styleUrls: ['./google-auth.component.scss']
})
export class GoogleAuthComponent {
  user: any;
  loggedIn: any;

  @Output() authenticated: EventEmitter<any> = new EventEmitter<any>()
  @Output() authenticationStarted: EventEmitter<any> = new EventEmitter<any>()


  constructor(private _socialAuthService: SocialAuthService,
              private _authService: AuthenticationService) {
  }

  ngOnInit() {

    this._socialAuthService.authState.subscribe((user) => {
      this.signIn(user);
    });

  }

  private signIn(user : SocialUser){
    this.user = user;
    this.loggedIn = (user != null);

    this.authenticationStarted.emit();

    let authRequest: AuthViaGoogleRequestContract = {
      authToken: this.user.idToken,
    }

    this._authService.authOrRegister(authRequest).subscribe(x => {
      this.authenticated.emit()
    })
  }

  signInWithGoogle(): void {
    const headers = {'Referrer-Policy': 'strict-origin-when-cross-origin'};
    this._socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID, {headers}).then((user) => {
      this.user = user;
      this.loggedIn = true;
      console.log(this.user);
    });
  }

  // public forceAuth() {
  //   let authRequest: AuthViaGoogleRequestContract = {
  //     authToken: this.user.idToken,
  //   }
  //
  //   this._authService.authUser(authRequest).then(r => console.log(r));
  // }
  //
  // public forceRegister() {
  //   let authRequest: AuthViaGoogleRequestContract = {
  //     authToken: this.user.idToken,
  //   }
  //
  //   this._authService.registerUser(authRequest).then(r => console.log(r));
  // }
  //
  // public async getClaims() {
  //   let claims = await this._authService.getClaims();
  //   console.log(claims)
  // }
}


