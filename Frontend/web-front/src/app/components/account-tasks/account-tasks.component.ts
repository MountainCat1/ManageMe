import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {TaskItem, TaskState} from "../../entities/taskItem";
import {TaskItemService} from "../../services/task-item.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-account-tasks',
  templateUrl: './account-tasks.component.html',
  styleUrls: ['./account-tasks.component.scss']
})
export class AccountTasksComponent implements OnInit {
  taskItems$!: Observable<TaskItem[]>

  todoTasks!: TaskItem[]
  doingTasks!: TaskItem[]
  doneTasks!: TaskItem[]

  constructor(private taskItemService: TaskItemService,
              private route: ActivatedRoute,
              private router : Router) {
  }

  ngOnInit() {
    this.fetchEntityData();
  }

  private fetchEntityData() {
    this.route.params.subscribe({
      next: params => {
        const accountId = params['accountId'];

        this.taskItems$ = this.taskItemService.getAllByAssignedUserId(accountId);

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
    this.taskItemService.delete(id).subscribe(x => {
      this.fetchEntityData();
    });
  }

  relativeNavigateTo(path: string) {
    this.router.navigate([`./${path}`], { relativeTo: this.route });
  }
}
