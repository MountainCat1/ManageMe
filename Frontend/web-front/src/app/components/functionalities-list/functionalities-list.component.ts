import {Component} from '@angular/core';
import {FunctionalityService} from "../../services/functionality.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Functionality, FunctionalityStatus} from "../../entities/functionality";
import {AccountRole} from "../../entities/account";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-functionalities-list',
  templateUrl: './functionalities-list.component.html',
  styleUrls: ['./functionalities-list.component.scss']
})
export class FunctionalitiesListComponent {
  public functionalities: Functionality[] = []
  private projectId! : string;
  statusOptions = [
    { value: FunctionalityStatus.Todo, label: 'Todo' },
    { value: FunctionalityStatus.Doing, label: 'Doing' },
    { value: FunctionalityStatus.Done, label: 'Done' },
  ];
  selectedStatus: FunctionalityStatus | null = null;

  constructor(private functionalityService: FunctionalityService, private route: ActivatedRoute, private router: Router, private accountService : AccountService) {
  }


  ngOnInit(): void {
    this.route.params.subscribe({
      next: route => {
        this.projectId = route['projectId'];
        this.fetchEntities();
      }
    })
  }

  deleteEntity(id: string) {
    this.accountService.getMyAccount().subscribe((account) => {
      if(account!.role !== AccountRole.DevOps)
        this.router.navigate(['./forbidden']);
      else{
        this.functionalityService.delete(id).subscribe({
          next: value => {
            this.fetchEntities()
          }
        })
      }
    })
  }

  public fetchEntities() {
    this.functionalityService.getByProjectId(this.projectId).subscribe({
      error: err => console.error(err),
      next: value => this.functionalities = value.filter(x => this.selectedStatus == null || this.selectedStatus == x.status)
    });
  }

  public relativeNavigateTo(target : string){
    this.router.navigate([target], { relativeTo: this.route });
  }
}
