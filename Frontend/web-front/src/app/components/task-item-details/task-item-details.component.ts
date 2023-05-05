import {Component, OnInit} from '@angular/core';
import {TaskItem} from "../../entities/taskItem";
import {ActivatedRoute} from "@angular/router";
import {TaskItemService} from "../../services/task-item.service";
import {map, Observable, of, switchMap} from "rxjs";
import {Project} from "../../entities/project";
import {Account} from "../../entities/account";
import {Functionality} from "../../entities/functionality";
import {ProjectService} from "../../services/project.service";
import {AccountService} from "../../services/account.service";
import {FunctionalityService} from "../../services/functionality.service";

@Component({
  selector: 'app-task-item-details',
  templateUrl: './task-item-details.component.html',
  styleUrls: ['./task-item-details.component.scss']
})
export class TaskItemDetailsComponent implements OnInit {
  public task!: TaskItem;
  public taskItemId: string | undefined;
  public estimatedTime: number | undefined;
  public timeSpent: number | undefined;

  public project$!: Observable<Project>
  public account$!: Observable<Account | undefined>
  public functionality$!: Observable<Functionality>

  constructor(
    private route: ActivatedRoute,
    private taskItemService: TaskItemService,
    private projectService: ProjectService,
    private accountService: AccountService,
    private functionalityService: FunctionalityService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getEntity(params['taskId'])
    });


  }

  public getEntity(id: string) {
    this.taskItemId = id;
    this.taskItemService.getById(id).subscribe({
      next: task => {
        this.task = task;

        this.project$ = this.functionalityService.getById(task.functionalityId).pipe(
          map(x => {
            this.functionality$ = of(x);
            return x;
          }),
          switchMap(x => {
            return this.projectService.getById(x.projectId);
          }))

        this.account$ = this.accountService.getByIdOrDefault(task.assignedUserId);
      }
    });

    this.estimatedTime = this.task?.estimatedTime;
  }

  startTask() {

  }

  completeTask() {

  }
}
