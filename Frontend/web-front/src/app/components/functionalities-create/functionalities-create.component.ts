import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FunctionalityCreate, FunctionalityService} from 'src/app/services/functionality.service';

@Component({
  selector: 'app-functionality-create',
  templateUrl: './functionalities-create.component.html',
  styleUrls: ['./functionalities-create.component.scss']
})
export class FunctionalityCreateComponent implements OnInit {
  public functionalityForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;
  private projectId!: string;


  constructor(
    private fb: FormBuilder,
    private functionalityService: FunctionalityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.functionalityForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priority: [1, Validators.required],
      projectId: ['', Validators.required],
      ownerId: [''],
      status: ['Todo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: route => {
        this.projectId = route['projectId'];
      }
    })
  }

  public checkIfShowError(propName: string): boolean {
    const form = this.functionalityForm;
    return (
      form.get(propName)!.invalid &&
      (form.get(propName)!.dirty ||
        form.get(propName)!.touched ||
        this.triedSubmit)
    );
  }

  public onSubmit(): void {
    this.triedSubmit = true;

    this.functionalityForm.get('projectId')!.setValue(this.projectId)

    if (!this.functionalityForm.valid) {
      console.error(this.allErrors);
      return;
    }

    const createDto: FunctionalityCreate = {
      name: this.functionalityForm.get('name')!.value,
      description: this.functionalityForm.get('description')!.value,
      priority: this.functionalityForm.get('priority')!.value,
      projectId: this.functionalityForm.get('projectId')!.value,
      ownerId: this.functionalityForm.get('ownerId')!.value,
      status: this.functionalityForm.get('status')!.value
    };

    this.loading = true;
    this.functionalityService.create(createDto).subscribe(() => {
      this.loading = false;
      this.goBack();
    });
  }

  public goBack(): void {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  public get allErrors(): string[] {
    const errors: string[] = [];
    const controls = this.functionalityForm.controls;

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
