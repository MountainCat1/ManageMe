import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  constructor(
    private router : Router,
    private route : ActivatedRoute,
  )
  {
  }

  public relativeNavigateTo(target : string){
    this.router.navigate([target], { relativeTo: this.route });
  }
}
