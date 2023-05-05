import {Component} from '@angular/core';
import {FunctionalityService} from "../../services/functionality.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Functionality, FunctionalityStatus} from "../../entities/functionality";

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
    { value: null, label: 'All' },
  ];
  selectedStatus: FunctionalityStatus | null = null;

  constructor(private functionalityService: FunctionalityService, private route: ActivatedRoute, private router: Router) {
  }


  ngOnInit(): void {
    this.route.params.subscribe({
      next: route => {
        this.projectId = route['projectId'];
        this.fetchEntities();
      }
    })

  }

  deleteEntity(projectId: string) {
    this.functionalityService.delete(projectId).subscribe({
      next: value => {
        this.fetchEntities()
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
