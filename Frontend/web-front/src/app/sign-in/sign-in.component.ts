import {Component, Inject} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  private router: Router;

  public loading : boolean = false;

  constructor(
    router: Router
  ) {
    this.router = router;
  }

  public OnAuthenticated(){
    this.loading = false;
    this.router.navigate(['/home']);
  }

  public OnAuthenticationStarted(){
    this.loading = true;
  }
}
