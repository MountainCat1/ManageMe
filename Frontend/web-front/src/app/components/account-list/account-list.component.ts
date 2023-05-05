import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

import {Account, AccountRole, getDisplayName} from '../../entities/account';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
  accounts$!: Observable<Account[]>;

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchEntityData();
  }

  private fetchEntityData() {
    this.route.params.subscribe({
      next: (params) => {
        const role = params['role'];

        this.accounts$ = this.accountService.getAll();

      },
    });
  }

  deleteEntity(id: string) {
    this.accountService.getMyAccount().subscribe((account) => {
      if(account!.role !== AccountRole.Admin)
        this.router.navigate(['./forbidden']);
      else{
        this.accountService.delete(id).subscribe(() => {
          this.fetchEntityData();
        });
      }
    })
  }

  relativeNavigateTo(path: string) {
    this.router.navigate([`./${path}`], { relativeTo: this.route });
  }

  protected readonly getDisplayName = getDisplayName;
}
