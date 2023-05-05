import {Injectable} from '@angular/core';
import {AccountService} from "./account.service";
import {Router} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {AccountRole} from "../entities/account";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceService {

  constructor(private accountService: AccountService, private router: Router, private cookieService : CookieService) {}

  guard(roles : AccountRole[]): Observable<boolean> {
    const auth_token = this.getAuthToken();
    if (!auth_token) {
      // Not authenticated
      this.router.navigate(['/login']);
      return of(false);
    }

    // Get the account ID from the account service
    return this.accountService.getMyAccount().pipe(
      map(account => {
        if (!account) {
          // Account not found, so not authenticated
          this.router.navigate(['/sign-in']);
          return false;
        }
        if (account.role !== AccountRole.Admin && roles.some(x => x === account.role)) {
          // User does not have the required role
          this.router.navigate(['/forbidden']);
          return false;
        }
        return true;
      })
    );
  }

  private getAuthToken(): string {
    return this.cookieService.get('auth_token');
  }
}
