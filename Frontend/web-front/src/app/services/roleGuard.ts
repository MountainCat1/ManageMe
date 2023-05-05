import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, map, Observable, of, switchMap} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {AccountRole} from "../entities/account";
import {AccountService} from "./account.service";

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const accountService = inject(AccountService);
  const router = inject(Router);
  let roles = route.data.roles as Array<AccountRole>;

  return authService.checkLogin().pipe(
    switchMap((authenticated) => {
      if (!authenticated) {
        // Not authenticated
        router.navigate(['../sign-in']).then(success => {});
        return of(false);
      }

      // Get the account ID from the account service
      return accountService.getMyAccount().pipe(
        map(account => {
          if (!account) {
            // Account not found, so not authenticated
            router.navigate(['/sign-in']);
            return false;
          }

          if (roles.includes(account.role)) {
            return true;
          } else {
            // User does not have the required role
            router.navigate(['/forbidden']);
            return false;
          }
        })
      );
    })
  );
};

// function getAuthToken(): string {
//   return cookieService.get('auth_token');
// }
