import {Component, Input, OnInit} from '@angular/core';
import {Account, getDisplayName} from "../../entities/account";
import {AccountService} from "../../services/account.service";
import {ProjectService} from "../../services/project.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-functionality-associated-account-list',
  templateUrl: './functionality-associated-account-list.component.html',
  styleUrls: ['./functionality-associated-account-list.component.scss']
})
export class FunctionalityAssociatedAccountListComponent implements OnInit {
  public accounts: Account[] = [];

  @Input() functionalityId! : string;
  constructor(
    private accountService : AccountService,
    private projectService : ProjectService,

    private route: ActivatedRoute,
    private router: Router)
  {
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: route => {
        this.functionalityId = route['projectId'];
        this.fetchEntities();
      }
    });
  }

  deleteEntity(accountId: string) {
    this.accountService.delete(accountId).subscribe({
      next: value => {
        this.fetchEntities();
      }
    });
  }

  private fetchEntities() {
    this.projectService.getAssociatedUsers(this.functionalityId).subscribe({
      next: accounts => {
        const filteredAccounts = accounts.filter(x => x != null) as Account[]
        this.accounts = filteredAccounts;
      }
    });
  }

  public relativeNavigateTo(target: string) {
    this.router.navigate([target], { relativeTo: this.route });
  }

  protected readonly getDisplayName = getDisplayName;
}
