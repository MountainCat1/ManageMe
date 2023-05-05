import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountCreate, AccountService } from '../../services/account.service';
import {AccountRole} from "../../entities/account";


@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {
  public accountForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      role: ['developer', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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

    const dto: AccountCreate = {
      username: this.accountForm.get('username')!.value,
      name: this.accountForm.get('name')!.value,
      surname: this.accountForm.get('surname')!.value,
      role: this.accountForm.get('role')!.value,
      password: this.accountForm.get('password')!.value,
    };

    this.loading = true;
    this.accountService.create(dto).subscribe(() => {
      this.loading = false;
      this.goBack();
    });
  }

  public goBack(): void {
    this.router.navigate(['../accounts']);
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


  protected readonly AccountRole = AccountRole;
}
