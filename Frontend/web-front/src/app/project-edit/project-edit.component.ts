import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectDtoContract} from "../contracts/projectDtoContract";

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  public projectForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;
  private projectId: string = "";

  constructor(private fb: FormBuilder, private projectService: ProjectService, private router: Router, private route: ActivatedRoute) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getEntity(params['id'])
    });
  }

  public getEntity(id : string) {
    this.projectId = id;
    this.projectService.getProject(id).subscribe({
      next: dto => {
        this.projectForm.patchValue(dto)
      }
    })
  }

  public checkIfShowError(propName: string) {
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

    const dto: ProjectDtoContract = {
      Name: this.projectForm.get('name')!.value,
      Description: this.projectForm.get('description')!.value
    }

    this.loading = true;
    this.projectService.updateProject(this.projectId, dto).subscribe(() => {
      this.loading = false;
      this.goBack()
    });
  }

  public goBack(): void {
    this.router.navigate(['../../'], {relativeTo: this.route});
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
