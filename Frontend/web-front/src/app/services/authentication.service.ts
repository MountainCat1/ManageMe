import {Injectable} from '@angular/core';
import {SocialUser} from "@abacritt/angularx-social-login";
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "src/environments/environment";
import {firstValueFrom} from "rxjs";
import 'url-join';
import urlJoin from "url-join";
import {AuthViaGoogleRequestContract} from "../contracts/authViaGoogleRequestContract";
import {AuthTokenResponseContract} from "../contracts/authTokenResponseContract";
import {GetClaimsResponseContract} from "../contracts/getClaimsResponseContract";
import {ClaimDto} from "../contracts/dtos/claimDto";

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

  public async authUser(authRequest: AuthViaGoogleRequestContract): Promise<string | undefined> {
    try {
      // Fetch user token from backend
      let headers: any = {
        // 'Authorization': `Bearer ${authRequest.token}`
      };

      let responseContract = await firstValueFrom(this.http.post<AuthTokenResponseContract>(urlJoin(this.apiUri, "auth/google"), authRequest, {
        responseType: 'json',
        headers: headers
      }));

      // Set token to cookies
      this._cookieService.set("auth_token", responseContract.authToken);

      // Return token
      return responseContract.authToken

    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async registerUser(authRequest: AuthViaGoogleRequestContract): Promise<void> {
    try {
      let headers: any = {};

      let url = urlJoin(this.apiUri, "auth/google/register");
      let response = await firstValueFrom(this.http.post(url,
        authRequest,
        {
          headers: headers
        }));

    } catch (error) {
      console.error(error);
      return;
    }
  }

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
}
