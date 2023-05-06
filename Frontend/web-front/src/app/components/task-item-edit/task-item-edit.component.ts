import {Component, OnInit} from '@angular/core';
import {TaskItem, TaskState} from "../../entities/taskItem";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {map, Observable, switchMap} from "rxjs";
import {Functionality} from "../../entities/functionality";
import {TaskItemService} from "../../services/task-item.service";
import {AccountService} from "../../services/account.service";
import {FunctionalityService} from "../../services/functionality.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Account, AccountRole, getDisplayName} from "../../entities/account";

@Component({
  selector: 'app-task-item-edit',
  templateUrl: './task-item-edit.component.html',
  styleUrls: ['./task-item-edit.component.scss']
})
export class TaskItemEditComponent implements OnInit {
  public taskForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;
  public taskItem!: TaskItem;
  public taskItem$!: Observable<TaskItem>;

  public user$!: Observable<Account>;
  public functionality!: Functionality;
  public accounts$!: Observable<Account[]>;

  constructor(
    private fb: FormBuilder,
    private taskItemService: TaskItemService,
    private accountService: AccountService,
    private functionalityService: FunctionalityService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priority: [1, Validators.required],
      estimatedTime: [1, Validators.required],
      state: [TaskState.Todo, Validators.required],
      assignedUserId: ['',],
      functionalityId: ['', Validators.required],
      workHoursDone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.taskItem$ = this.route.params.pipe(
      map(params => ({taskId: params.taskId, functionalityId: params.functionalityId})),
      switchMap((params) => {
        return this.taskItemService.getById(params.taskId);
      })
    );

    this.taskItem$.subscribe(taskItem => {
      this.taskItem = taskItem;
      this.taskForm.patchValue(taskItem);
    });

    this.accounts$ = this.accountService.getAll().pipe(map(accounts => {
      return accounts.filter(x => x.role === AccountRole.Developer);
    }));
  }

  public checkIfShowError(propName: string): boolean {
    const form = this.taskForm;
    return (
      form.get(propName)!.invalid &&
      (form.get(propName)!.dirty ||
        form.get(propName)!.touched ||
        this.triedSubmit)
    );
  }

  public onSubmit(): void {
    this.triedSubmit = true;

    if (!this.taskForm.valid) {
      console.error(this.allErrors);
      return;
    }

    const updateDto: TaskItem = {
      ...this.taskItem,
      ...this.taskForm.value
    };

    this.loading = true;
    this.functionalityService.updateTask(this.taskItem.functionalityId, updateDto).subscribe(() => {
      this.loading = false;
      this.goBack();
    });
  }

  public goBack(): void {
    this.router.navigate(['../../../'], {relativeTo: this.route});
  }

  public get allErrors(): string[] {
    const errors: string[] = [];
    const controls = this.taskForm.controls;

    for (const key of Object.keys(controls)) {
      const controlErrors: any = controls[key].errors;
      if (controlErrors) {
        for (const error of Object.keys(controlErrors))
          errors.push(`${key} ${error}`);
      }
    }
    return errors;
  }

  protected readonly TaskState = TaskState;
  protected readonly getDisplayName = getDisplayName;
}
