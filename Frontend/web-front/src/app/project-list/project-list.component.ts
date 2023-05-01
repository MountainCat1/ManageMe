import {Component, OnInit} from '@angular/core';
import {ProjectDto} from "../contracts/dtos/projectDto";
import {ProjectService} from "../services/project.service";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public projects: ProjectDto[] = []

  constructor(private projectService: ProjectService) {
  }


  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      error: err => console.error(err),
      next: value => this.projects = value
    });
  }

}
