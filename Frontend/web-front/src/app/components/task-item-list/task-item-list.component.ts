import {Component, OnInit} from '@angular/core';
import {TaskItem, TaskState} from "../../entities/taskItem";
import {TaskItemService} from "../../services/task-item.service";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-task-item-list',
  templateUrl: './task-item-list.component.html',
  styleUrls: ['./task-item-list.component.scss']
})
export class TaskItemListComponent implements OnInit {
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
    this.taskItemService.delete(id).subscribe(x => {
      this.fetchEntityData();
    });
  }

  relativeNavigateTo(path: string) {
    this.router.navigate([`./${path}`], { relativeTo: this.route });
  }
}
