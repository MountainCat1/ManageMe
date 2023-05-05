import {Component, OnInit} from '@angular/core';
import {Project} from "../../entities/project";
import {ProjectService} from "../../services/project.service";
import {ActivatedRoute} from "@angular/router";
import {Functionality, FunctionalityStatus} from "../../entities/functionality";
import {FunctionalityService} from "../../services/functionality.service";
import {map, Observable} from "rxjs";
import {Account, getDisplayName} from "../../entities/account";
import {AccountService} from "../../services/account.service";
import {TaskItemService} from "../../services/task-item.service";

@Component({
  selector: 'app-functionality-details',
  templateUrl: './functionality-details.component.html',
  styleUrls: ['./functionality-details.component.scss']
})
export class FunctionalityDetailsComponent implements OnInit {
  public functionality$!: Observable<Functionality>;
  public functionalityId!: string;
  public projectId!: string;

  public owner$!: Observable<Account | undefined>;
  public project$!: Observable<Project>;

  public workHours$!: Observable<number>;
  public estimatedTime$!: Observable<number>;


  constructor(private projectService: ProjectService,
              private functionalityService: FunctionalityService,
              private taskItemService: TaskItemService,
              private accountService: AccountService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.fetchEntityData()
  }

  fetchEntityData(){
    this.route.params.subscribe(params => {
      this.functionalityId = params['functionalityId'];
      this.projectId = params['projectId'];
      this.functionality$ = this.functionalityService.getById(this.functionalityId);

      this.functionality$.subscribe({
        next: functionality => {

          this.owner$ = this.accountService.getByIdOrDefault(functionality.ownerId!);
          this.project$ = this.projectService.getById(functionality.projectId);
        }
      })

      this.workHours$ = this.taskItemService.getAllByFunctionalityId(this.functionalityId).pipe(
        map(x => {
          return x.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.workHoursDone;
          }, 0);
        })
      )

      this.estimatedTime$ = this.taskItemService.getAllByFunctionalityId(this.functionalityId).pipe(
        map(x => {
          return x.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.estimatedTime;
          }, 0);
        })
      )
    });
  }

  markAsDone() {
    this.functionalityService.setStatus(this.functionalityId, FunctionalityStatus.Done).subscribe(x => {
      this.fetchEntityData();
    });
  }
;

  protected readonly FunctionalityStatus = FunctionalityStatus;
  protected readonly getDisplayName = getDisplayName;
}
