import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskItemService} from '../../services/task-item.service';
import {TaskItemFactory} from "../../entities/taskItem";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-create-task-item',
  templateUrl: './task-item-create.component.html',
  styleUrls: ['./task-item-create.component.scss'],
})
export class CreateTaskItemComponent implements OnInit {
  public taskForm: FormGroup;
  public loading: boolean = false;
  public triedSubmit: boolean = false;
  private functionalityId!: string;

  constructor(
    private fb: FormBuilder,
    private taskItemService: TaskItemService,
    private router: Router,
    private route : ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      estimatedTime: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe({
      next: params => {
        this.functionalityId = params['functionalityId']
      }
    })
  }

  public checkIfShowError(propName: string) {
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

    const taskItem = TaskItemFactory.create(
      this.taskForm.get('name')!.value,
      this.taskForm.get('description')!.value,
      this.taskForm.get('priority')!.value,
      '',
      this.taskForm.get('estimatedTime')!.value
    );

    this.loading = true;
    this.taskItemService.create(
      taskItem.name,
      taskItem.description,
      taskItem.priority,
      this.functionalityId,
      taskItem.estimatedTime
    ).subscribe(() => {
      this.loading = false;
      this.goBack()
    });
  }

  public get allErrors(): string[] {
    const errors: string[] = [];
    const controls = this.taskForm.controls;

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

  public goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
