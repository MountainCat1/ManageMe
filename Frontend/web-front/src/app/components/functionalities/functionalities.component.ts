import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-functionalities',
  templateUrl: './functionalities.component.html',
  styleUrls: ['./functionalities.component.scss']
})
export class FunctionalitiesComponent {
  constructor(private router : Router, private route: ActivatedRoute) {

  }
  public relativeNavigateTo(target : string){
    this.router.navigate([target], { relativeTo: this.route });
  }
}
