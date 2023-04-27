import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  private router: Router;

  constructor(
    router: Router
  ) {
    this.router = router;
  }

  public OnAuthenticated(){
    this.router.navigate(['/home']);
  }
}
