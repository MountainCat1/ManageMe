import {Component, Input, OnInit} from '@angular/core';
import {AccountService} from "../../services/account.service";
import {ProjectService} from "../../services/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Account, getDisplayName} from "../../entities/account";

@Component({
  selector: 'app-project-associated-account-list',
  templateUrl: './project-associated-account-list.html',
  styleUrls: ['./project-associated-account-list.scss']
})
export class ProjectAssociatedAccountList implements OnInit {
  public accounts: Account[] = [];

  @Input() projectId! : string;
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
        this.projectId = route['projectId'];
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
    this.projectService.getAssociatedUsers(this.projectId).subscribe({
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

