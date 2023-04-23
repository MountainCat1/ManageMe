import {Injectable} from '@angular/core';
import {SocialUser} from "@abacritt/angularx-social-login";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environments/environment";
import {firstValueFrom} from "rxjs";
import 'url-join';
import {AuthViaGoogleRequestContract} from "../dtos/authViaGoogleRequestContract";
import urlJoin from "url-join";

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
      let headers : any = {
        // 'Authorization': `Bearer ${authRequest.token}`
      };

      let authToken = await firstValueFrom(this.http.post(urlJoin(this.apiUri, "auth/google"), authRequest, {responseType: 'text', headers: headers}));

      // Set token to cookies
      this._cookieService.set("auth_token", authToken);

      // Return token
      return authToken

    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

}
