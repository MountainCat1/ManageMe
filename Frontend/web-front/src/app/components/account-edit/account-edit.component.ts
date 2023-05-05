import {Component, OnInit} from '@angular/core';
import {Account, AccountRole} from "../../entities/account";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../services/account.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent  implements OnInit {
  public accountForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;
  public account!: Account;

  public roles = Object.values(AccountRole);
  // public roles$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accountForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      role: ['', Validators.required]
    });
    // this.roles$ = this.accountService.getRoles();
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: route => {
        const accountId = route['accountId'];
        this.accountService.getById(accountId).subscribe({
          next: account => {
            this.account = account;
            this.accountForm.patchValue({
              username: account.username,
              name: account.name,
              surname: account.surname,
              role: account.role
            });
          }
        });
      }
    });
  }

  public checkIfShowError(propName: string): boolean {
    const form = this.accountForm;
    return (
      form.get(propName)!.invalid &&
      (form.get(propName)!.dirty ||
        form.get(propName)!.touched ||
        this.triedSubmit)
    );
  }

  public onSubmit(): void {
    this.triedSubmit = true;

    if (!this.accountForm.valid) {
      console.error(this.allErrors);
      return;
    }

    const updatedAccount: Account = {
      ...this.account,
      username: this.accountForm.get('username')!.value,
      name: this.accountForm.get('name')!.value,
      surname: this.accountForm.get('surname')!.value,
      role: this.accountForm.get('role')!.value
    };

    this.loading = true;
    this.accountService.update(updatedAccount).subscribe({
      next: () => {
        this.loading = false;
        this.goBack();
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  public goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  public get allErrors(): string[] {
    const errors: string[] = [];
    const controls = this.accountForm.controls;

    for (const key of Object.keys(controls)) {
      const controlErrors: any = controls[key].errors;
      if (controlErrors) {
        for (const error of Object.keys(controlErrors)) {
          errors.push(`${key} ${error}`);
        }
      }
    }

    return errors;
  }
}
