import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {map, of, switchMap} from "rxjs";
import {AuthenticationService} from "./authentication.service";
import {AccountRole} from "../entities/account";
import {AccountService} from "./account.service";
import {TaskItemService} from "./task-item.service";

export const ownTaskGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const accountService = inject(AccountService);
  const taskService = inject(TaskItemService);
  const router = inject(Router);

  return authService.checkLogin().pipe(
    switchMap((authenticated) => {
      if (!authenticated) {
        // Not authenticated
        router.navigate(['../sign-in']).then(success => {});
        return of(false);
      }

      const taskId = route.params.taskId;
      if (!taskId) {
        // No task ID in the route
        router.navigate(['/forbidden']);
        return of(false);
      }

      // Get the task from the task service
      return taskService.getById(taskId).pipe(
        switchMap(task => {
          if (!task) {
            // Task not found
            router.navigate(['/forbidden']);
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

              if(account.role === AccountRole.DevOps)
                return true;

              if (task.assignedUserId !== account.id) {
                // Task does not belong to the account
                router.navigate(['/forbidden']);
                return false;
              }

              return true;
            })
          );
        })
      );
    })
  );
};
