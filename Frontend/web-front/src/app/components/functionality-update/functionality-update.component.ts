import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Functionality, FunctionalityStatus} from "../../entities/functionality";
import {FunctionalityService, FunctionalityUpdate} from "../../services/functionality.service";
import {Observable} from "rxjs";
import {Project} from "../../entities/project";
import {ProjectService} from "../../services/project.service";
import {Account, getDisplayName} from "../../entities/account";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-functionality-update',
  templateUrl: './functionality-update.component.html',
  styleUrls: ['./functionality-update.component.scss']
})
export class FunctionalityUpdateComponent implements OnInit {
  public functionalityForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;
  public functionality!: Functionality;
  private projectId!: string;

  public projects$!: Observable<Project[]>;
  public accounts$!: Observable<Account[]>;

  constructor(
    private fb: FormBuilder,
    private functionalityService: FunctionalityService,
    private router: Router,
    private route: ActivatedRoute,
    private projectService : ProjectService,
    private accountService : AccountService,
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
        const functionalityId = route['functionalityId'];
        this.projectId = route['projectId'];

        this.functionalityService.getById(functionalityId).subscribe({
          next: functionality => {
            this.functionality = functionality;
            this.functionalityForm.patchValue({
              name: functionality.name,
              description: functionality.description,
              priority: functionality.priority,
              projectId: functionality.projectId,
              ownerId: functionality.ownerId,
              status: functionality.status
            });
          }
        });

        this.projects$ = this.projectService.getAll()
        this.accounts$ = this.accountService.getAll()

        this.projectService.getAll().subscribe({
          next: value => {
            console.log(value)
          }
        })
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

    if (!this.functionalityForm.valid) {
      console.error(this.allErrors);
      return;
    }

    const updateDto: FunctionalityUpdate = {
      id: this.functionality.id,
      name: this.functionalityForm.get('name')!.value,
      description: this.functionalityForm.get('description')!.value,
      priority: this.functionalityForm.get('priority')!.value,
      projectId: this.functionality.projectId,
      ownerId: this.functionalityForm.get('ownerId')!.value,
      status: this.functionalityForm.get('status')!.value
    };

    this.loading = true;
    this.functionalityService.update(updateDto).subscribe(() => {
      this.loading = false;
      this.goBack();
    });
  }

  public goBack(): void {
    this.router.navigate(['../../../'], { relativeTo: this.route });
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

  protected readonly FunctionalityStatus = FunctionalityStatus;
  protected readonly getDisplayName = getDisplayName;
}
