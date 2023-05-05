import {Injectable} from '@angular/core';
import {TaskItem, TaskItemFactory, TaskState} from "../entities/taskItem";
import {Observable, of} from "rxjs";
import {FunctionalityService} from "./functionality.service";
import {FunctionalityStatus} from "../entities/functionality";

@Injectable({
  providedIn: 'root'
})
export class TaskItemService {

  private readonly storageKey = 'taskItems';

  constructor() {
  }

  getAllByFunctionalityId(functionalityId: string): Observable<TaskItem[]> {
    const entities = this.getAllFromLocalStorage();
    const filteredEntities = entities.filter(
      (entity) => entity.functionalityId === functionalityId
    );
    return of(filteredEntities);
  }

  getById(id: string): Observable<TaskItem> {
    const entities = this.getAllFromLocalStorage();
    const entity = entities.find((e) => e.id === id);
    return of(entity as TaskItem);
  }

  create(
    name: string,
    description: string,
    priority: number,
    functionalityId: string,
    estimatedTime: number,
    assignedUserId?: string
  ): Observable<TaskItem> {
    const entity: TaskItem = TaskItemFactory.create(
      name,
      description,
      priority,
      functionalityId,
      estimatedTime,
      undefined,
      undefined,
      assignedUserId
    );
    const entities = this.getAllFromLocalStorage();
    entities.push(entity);
    this.saveAllToLocalStorage(entities);
    return of(entity);
  }

  update(entity: TaskItem): Observable<void> {
    const entities = this.getAllFromLocalStorage();
    const index = entities.findIndex((e) => e.id === entity.id);

    const prev = entities[index];

    if(prev.state == TaskState.Todo && entity.state == TaskState.Doing){
      entity.startedDate = new Date();
    }

    if(prev.state == TaskState.Doing && entity.state == TaskState.Done)
      entity.completedDate = new Date();

    entities[index] = entity;


    this.saveAllToLocalStorage(entities);
    return of(void 0);
  }

  delete(id: string): Observable<void> {
    const entities = this.getAllFromLocalStorage();
    const index = entities.findIndex((e) => e.id === id);
    entities.splice(index, 1);
    this.saveAllToLocalStorage(entities);
    return of(void 0);
  }

  updateState(id: string, state: TaskState): Observable<void> {
    const entities = this.getAllFromLocalStorage();
    const index = entities.findIndex((e) => e.id === id);
    entities[index].state = state;
    entities[index].startedDate = state === TaskState.Doing ? new Date() : undefined;
    entities[index].completedDate = state === TaskState.Done ? new Date() : undefined;
    this.saveAllToLocalStorage(entities);
    return of(void 0);
  }

  getAllByAssignedUserId(
    assignedUserId: string
  ): Observable<TaskItem[]> {
    const entities = this.getAllFromLocalStorage();
    const filteredEntities = entities.filter(
      (entity) => entity.assignedUserId === assignedUserId
    );
    return of(filteredEntities);
  }

  private getAllFromLocalStorage(): TaskItem[] {
    const entitiesJson = localStorage.getItem(this.storageKey);
    return entitiesJson ? JSON.parse(entitiesJson) : [];
  }

  private saveAllToLocalStorage(entities: TaskItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(entities));
  }
}
