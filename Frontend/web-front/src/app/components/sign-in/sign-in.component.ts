import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  private loginForm: FormGroup;

  public loading : boolean = false;
  @Input() username: string = "";
  @Input() password: string = "";
  constructor(
    private router: Router,
    private formBuilder : FormBuilder,
    private authenticationService : AuthenticationService
  ) {
    this.router = router;
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    this.OnAuthenticationStarted()

    this.authenticationService.authUser(this.username, this.password).subscribe({
      next: () => {
        this.OnAuthenticated()
      }
    });
  }
  public OnAuthenticated(){
    this.loading = false;
    this.router.navigate(['/home']);
  }

  public OnAuthenticationStarted(){
    this.loading = true;
  }
}
