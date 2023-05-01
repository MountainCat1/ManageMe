import {Component, OnInit, Output} from '@angular/core';
import {AuthHttpService} from "../services/auth-http.service";
import {AccountService} from "../services/account.service";
import {ActivatedRoute} from "@angular/router";
import {AccountDto} from "../contracts/dtos/accountDto";

@Component({
  selector: 'app-my-account-bar',
  templateUrl: './my-account-bar.component.html',
  styleUrls: ['./my-account-bar.component.scss']
})
export class MyAccountBarComponent implements OnInit{

  @Output()
  public username : string = "";
  @Output()
  public role : string = "";


  constructor(private accountService: AccountService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.updateProfile()
    });
  }

  private updateProfile() {
    this.accountService.getMyAccount().subscribe({
      next: accountDto => {
        this.username = accountDto.username;
        this.role = accountDto.role.name;
      }
    });
  }

  private applyUpdate(account : AccountDto){
    this.username = account.username;
    this.role = account.role.name;
  }
}
