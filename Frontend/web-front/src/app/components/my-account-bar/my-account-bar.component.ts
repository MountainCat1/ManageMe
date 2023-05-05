import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {Account, getDisplayName} from "../../entities/account";
import {Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-my-account-bar',
  templateUrl: './my-account-bar.component.html',
  styleUrls: ['./my-account-bar.component.scss']
})
export class MyAccountBarComponent implements OnInit {

  public account$!: Observable<Account | undefined>


  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.account$ = this.accountService.getMyAccount()


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.account$ = this.accountService.getMyAccount()
      }
    });
  }

  protected readonly getDisplayName = getDisplayName;

  logOff() {
    this.cookieService.delete('auth_token');
    this.router.navigate(['/sign-in']);
    this.account$ = this.accountService.getMyAccount()
  }
}
