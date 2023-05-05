import {Component, OnInit} from '@angular/core';
import {Project} from "../../entities/project";
import {ProjectService} from "../../services/project.service";
import {AccountRole} from "../../entities/account";
import {Router} from "@angular/router";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public projects: Project[] = []
  public activatedProjectId: string | undefined;

  constructor(private projectService: ProjectService, private router : Router, private accountService : AccountService) {
  }


  ngOnInit(): void {
    this.fetchProjects();
  }

  deleteEntity(id: string) {
    this.accountService.getMyAccount().subscribe((account) => {
      if(account!.role !== AccountRole.DevOps)
        this.router.navigate(['./forbidden']);
      else{
        this.projectService.delete(id).subscribe({
          next: value => {
            this.fetchProjects()
          }
        })
      }
    })
  }

  private fetchProjects() {
    this.projectService.getActiveProject().subscribe({
      next: id => {
        this.activatedProjectId = id;
      }
    })

    this.projectService.getAll().subscribe({
      error: err => console.error(err),
      next: value => this.projects = value
    });
  }

  activateProject(id: any) {
    this.projectService.setActiveProject(id).subscribe({
      next: id => {
        this.fetchProjects()
      }
    });
  }

  public get GetNotActivatedProjects(){
    return this.projects.filter(x => x.id != this.activatedProjectId)
  }
  public get GetActivatedProjects(){
    return this.projects.filter(x => x.id === this.activatedProjectId)
  }
}
