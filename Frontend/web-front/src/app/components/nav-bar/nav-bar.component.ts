import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(private router : Router,
              private projectService : ProjectService) {

  }

  onLinkClick(target : string) {
    this.router.navigate([target]);
  }

  goToFunctionalities(){
    this.projectService.getActiveProject()
      .subscribe({
        next: id => {
          this.router.navigate([`/projects/${id}`])
        }
      })

  }
}
