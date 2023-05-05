import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskItem, TaskState} from "../../entities/taskItem";
import {TaskItemService} from "../../services/task-item.service";
import {map, Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountRole} from "../../entities/account";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-task-item-list',
  templateUrl: './task-item-list.component.html',
  styleUrls: ['./task-item-list.component.scss']
})
export class TaskItemListComponent implements OnInit {
  @Output() onDelete = new EventEmitter<null>();

  taskItems$!: Observable<TaskItem[]>

  todoTasks!: TaskItem[]
  doingTasks!: TaskItem[]
  doneTasks!: TaskItem[]

  constructor(private taskItemService: TaskItemService,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.fetchEntityData();
  }

  private fetchEntityData() {
    this.route.params.subscribe({
      next: params => {
        const projectId = params['projectId'];
        const functionalityId = params['functionalityId'];

        this.taskItems$ = this.taskItemService.getAllByFunctionalityId(functionalityId);

        this.taskItems$.subscribe({
          next: value => {
            this.todoTasks = value.filter(x => x.state == TaskState.Todo);
            this.doingTasks = value.filter(x => x.state == TaskState.Doing);
            this.doneTasks = value.filter(x => x.state == TaskState.Done);
          }
        });
      }
    })
  }

  deleteEntity(id: string) {
    this.accountService.getMyAccount().pipe(
      switchMap(account => {
        if (account!.role === AccountRole.DevOps) {
          return this.taskItemService.delete(id);
        } else {
          return this.taskItemService.getAllByAssignedUserId(account!.id).pipe(
            switchMap(tasks => {
              if (tasks.map(x => x.id).includes(id)) {
                return this.taskItemService.delete(id);
              } else {
                this.router.navigate(['./forbidden']);
                return of(undefined);
              }
            })
          );
        }
      })
    ).subscribe(() => {
      this.fetchEntityData();
      this.onDelete.emit();
    });
  }

  relativeNavigateTo(path: string) {
    this.router.navigate([`./${path}`], {relativeTo: this.route});
  }
}
