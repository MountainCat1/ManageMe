import {Injectable} from '@angular/core';
import {SocialUser} from "@abacritt/angularx-social-login";
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "src/environments/environment";
import {catchError, delay, firstValueFrom, from, map, NotFoundError, Observable, of, switchMap, throwError} from "rxjs";
import 'url-join';
import urlJoin from "url-join";
import {AuthViaGoogleRequestContract} from "../contracts/authViaGoogleRequestContract";
import {AuthTokenResponseContract} from "../contracts/authTokenResponseContract";
import {GetClaimsResponseContract} from "../contracts/getClaimsResponseContract";
import {ClaimDto} from "../contracts/dtos/claimDto";
import {augmentIndexHtml} from "@angular-devkit/build-angular/src/utils/index-file/augment-index-html";
import {AuthViaPasswordRequest} from "../contracts/authViaPasswordRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUri = environment.apiEndpoint;

  constructor(private _cookieService: CookieService, private http: HttpClient) {
  }

  public getUser(): SocialUser | undefined {
    // TODO

    return undefined;
  }

  public async authUserViaGoogle(authRequest: AuthViaGoogleRequestContract): Promise<string | undefined> {
    console.log('Authenticating...')
    let headers: any = {
      // 'Authorization': `Bearer ${authRequest.token}`
    };

    const uri = urlJoin(this.apiUri, "auth/google");

    let responseContract = await firstValueFrom(this.http.post<AuthTokenResponseContract>(uri, authRequest, {
      responseType: 'json',
      headers: headers
    }));

    // Set token to cookies
    this._cookieService.set("auth_token", responseContract.authToken);

    // Return token
    return responseContract.authToken
  }

  public authUser(username: string, password: string): Observable<AuthTokenResponseContract> {
    console.log('Authenticating...')
    let headers: any = {
      // 'Authorization': `Bearer ${authRequest.token}`
    };

    const uri = urlJoin(this.apiUri, "auth");

    const authRequest: AuthViaPasswordRequest = {
      password: password,
      username: username
    }

    const obs = this.http.post<AuthTokenResponseContract>(uri, authRequest, {
      responseType: 'json',
      headers: headers
    })

    obs.subscribe({
      next: response => {
        this._cookieService.set("auth_token", response.authToken);
      }
    })
    return obs;
  }

  public async registerUser(authRequest: AuthViaGoogleRequestContract): Promise<void> {
    console.log('Registering...')
    let headers: any = {};

    let url = urlJoin(this.apiUri, "auth/google/register");
    let response = await firstValueFrom(this.http.post(url,
      authRequest,
      {
        headers: headers
      }));
  }


  public authOrRegister(authRequest: AuthViaGoogleRequestContract) {
    return from(this.authUserViaGoogle(authRequest)).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 404) {
          console.log('Account not found, registering...');
          return from(this.registerUser(authRequest)).pipe(
            switchMap(() => this.authUserViaGoogle(authRequest)),
          );
        } else {
          return throwError(error);
        }
      }),
    );
  }

  // public async authOrRegister(authRequest: AuthViaGoogleRequestContract): Promise<void> {
  //   try {
  //     await this.authUser(authRequest);
  //   } catch (error) {
  //     if (error instanceof HttpErrorResponse && error.status === 404) {
  //       console.log('Account not found, registering...')
  //       await this.registerUser(authRequest);
  //       await this.authUser(authRequest);
  //       return;
  //     }
  //
  //     console.error(error);
  //     return;
  //   }
  // }

  public async getClaims(): Promise<ClaimDto[] | undefined> {
    try {
      // Set token to cookies
      let authToken = this._cookieService.get("auth_token");

      let headers: HttpHeaders = new HttpHeaders({
        'Authorization': `Bearer ${authToken}`
      });

      let url = urlJoin(this.apiUri, "claims");
      let claims = await firstValueFrom(this.http.get<GetClaimsResponseContract>(url,
        {
          headers: headers
        }));

      return claims.claims;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  logout(): void {
    // Remove user authentication data from storage
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    // Check if user authentication data exists in storage
    return !!localStorage.getItem('auth_token');
  }

  hasAuthToken(): boolean {
    return !!this._cookieService.get("auth_token");
  }

  checkLogin(): Observable<boolean> {

    if (!this.hasAuthToken())
      return of(false)


    return of(true);
    // Make an API request to check if the user is logged in
    // return this.http.get<boolean>(`${this.apiUri}/check-login`).pipe(
    //   map((response) => {
    //     // User is logged in
    //     return response;
    //   }),
    //   catchError(() => {
    //     // User is not logged in
    //     return of(false);
    //   })
    // );
  }

  public getToken(): string {
    return this._cookieService.get('auth_token')
  }
}
