import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Account } from '../../entities/account';
import { AccountService } from '../../services/account.service';
import { Functionality } from '../../entities/functionality';
import { FunctionalityService } from '../../services/functionality.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  public account$!: Observable<Account>;
  public functionalities$!: Observable<Functionality[]>;
  public accountId!: string;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private functionalityService: FunctionalityService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.account$ = this.accountService.getById(this.accountId);
      this.functionalities$ = this.functionalityService.getAllByOwnerId(this.accountId);
    });
  }
}
