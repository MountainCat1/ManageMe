import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  constructor(private router : Router, private route: ActivatedRoute) {

  }

  public relativeNavigateTo(target : string){
    this.router.navigate([target], { relativeTo: this.route });
  }
}
