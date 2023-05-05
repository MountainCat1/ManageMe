import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {Account} from "../../entities/account";

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
      next: account => {
        if(account == undefined)
          return;

        this.applyUpdate(account)
      }
    });
  }

  private applyUpdate(account : Account){
    this.username = account.username;
    this.role = account.role;
  }
}
