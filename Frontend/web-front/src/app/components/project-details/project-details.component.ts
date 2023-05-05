import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {Project} from "../../entities/project";
import {ActivatedRoute} from "@angular/router";
import {TaskItemService} from "../../services/task-item.service";
import {FunctionalityService} from "../../services/functionality.service";
import {map, Observable} from "rxjs";
import {TaskState} from "../../entities/taskItem";

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit{

  public project! : Project;
  public projectId : string | undefined;

  public workHoursDone$! : Observable<number | undefined>
  public estimatedDuration$! : Observable<number | undefined>

  constructor(
    private projectService : ProjectService,
    private route : ActivatedRoute,
    private taskItemService : TaskItemService,
    private functionalityService : FunctionalityService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getEntity(params['projectId'])
    });


  }

  public getEntity(id : string) {
    this.projectId = id;
    this.projectService.getById(id).subscribe({
      next: entity => {
        this.project = entity;
      }
    })

    this.estimatedDuration$ = this.projectService.getAllTaskItemsByProjectId(id).pipe(map(x => {
      return x.reduce((accumulator, currentValue) => accumulator + currentValue.estimatedTime, 0);
    }))

    this.workHoursDone$ = this.projectService.getAllTaskItemsByProjectId(id).pipe(map(x => {
      return x.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.workHoursDone;
      }, 0);
    }))
  }
}
