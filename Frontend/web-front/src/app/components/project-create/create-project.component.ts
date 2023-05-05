import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectCreate, ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  public projectForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;

  constructor(private fb: FormBuilder, private projectService: ProjectService, private router: Router, private route : ActivatedRoute) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required ],
      description: ['', Validators.required ]
    });
  }

  public checkIfShowError(propName : string){
    const form = this.projectForm;

    return form.get(propName)!.invalid
      && (form.get(propName)!.dirty || form.get(propName)!.touched || this.triedSubmit);
  }

  public onSubmit(): void {
    this.triedSubmit = true;

    if (!this.projectForm.valid) {
      console.error(this.allErrors);
      return;
    }

    const dto: ProjectCreate = {
      name: this.projectForm.get('name')!.value,
      description: this.projectForm.get('description')!.value,
      startTime: new Date()
    }

    this.loading = true;
    this.projectService.create(dto).subscribe(() => {
      this.loading = false;
      this.goBack()
    });
  }

  public goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public get allErrors(): string[] {
    const errors: string[] = [];
    const controls = this.projectForm.controls;

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
