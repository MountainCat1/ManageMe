import {Injectable} from '@angular/core';
import {Functionality, FunctionalityStatus} from "../entities/functionality";
import {defaultIfEmpty, forkJoin, map, Observable, of, switchMap, zip} from "rxjs";
import {v4 as uuidv4} from 'uuid';
import {TaskItem, TaskState} from "../entities/taskItem";
import {TaskItemService} from "./task-item.service";
import {Account} from "../entities/account";
import {AccountService} from "./account.service";


export interface FunctionalityCreate {
  name: string;
  description: string;
  priority: number;
  projectId: string;
  ownerId?: string;
  status?: FunctionalityStatus;
}

export interface FunctionalityUpdate {
  id: string;
  name: string;
  description: string;
  priority: number;
  projectId: string;
  ownerId?: string;
  status: FunctionalityStatus;
}

@Injectable({
  providedIn: 'root'
})
export class FunctionalityService {
  private readonly storageKey = 'functionalities';

  constructor(private taskItemService: TaskItemService, private accountService: AccountService) {
  }

  getByProjectId(projectId: string): Observable<Functionality[]> {
    const entities = this.getAllFromLocalStorage();
    const filteredEntities = entities.filter((entity) => entity.projectId === projectId);

    return of(filteredEntities);
  }

  getById(id: string): Observable<Functionality> {
    const entities = this.getAllFromLocalStorage();
    const entity = entities.find((e) => e.id === id);
    return of(entity as Functionality);
  }

  create(createDto: FunctionalityCreate): Observable<Functionality> {
    const entity: Functionality = {
      id: uuidv4(),
      name: createDto.name,
      description: createDto.description,
      priority: createDto.priority,
      projectId: createDto.projectId,
      ownerId: createDto.ownerId,
      status: createDto.status ?? FunctionalityStatus.Todo,
      addDate: new Date(),
      startDate: undefined
    };
    const entities = this.getAllFromLocalStorage();
    entities.push(entity);
    this.saveAllToLocalStorage(entities);
    return of(entity);
  }

  public update(updateDto: FunctionalityUpdate): Observable<void> {
    const entities = this.getAllFromLocalStorage();
    const index = entities.findIndex((e) => e.id === updateDto.id);
    entities[index] = {...entities[index], ...updateDto};
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

  getAllTaskItemsByFunctionalityId(
    functionalityId: string
  ): Observable<TaskItem[]> {
    return this.taskItemService.getAllByFunctionalityId(functionalityId);
  }

  getAllByOwnerId(ownerId: string): Observable<Functionality[]> {
    const entities = this.getAllFromLocalStorage();
    const filteredEntities = entities.filter(
      (entity) => entity.ownerId === ownerId
    );
    return of(filteredEntities);
  }

  getOwner(functionalityId: string): Observable<Account | undefined> {
    return this.getById(functionalityId).pipe(
      switchMap((functionality) => {
        if (functionality.ownerId) {
          return this.accountService.getById(functionality.ownerId);
        } else {
          return of(undefined);
        }
      })
    );
  }

  updateTask(id: string, entity: TaskItem): Observable<void> {
    if (id !== entity.functionalityId)
      throw new Error('Functionality and task id doesnt match!');

    if (entity.state === TaskState.Doing) {
      this.getById(id).subscribe(x => {
        if (x.status === FunctionalityStatus.Todo) {
          this.setStatus(id, FunctionalityStatus.Doing);
        }
      })
    }


    return this.taskItemService.update(entity);
  }

  public setStatus(id: string, status: FunctionalityStatus): Observable<void> {
    const entities = this.getAllFromLocalStorage();
    const index = entities.findIndex((e) => e.id === id);

    if (status === FunctionalityStatus.Doing && entities[index].status === FunctionalityStatus.Todo)
      entities[index].startDate = new Date()

    entities[index].status = status;
    this.saveAllToLocalStorage(entities);
    return of(void 0);
  }

  getAssociatedUsers(functionalityService: string): Observable<(Account | undefined)[]> {

    const byTask = this.taskItemService.getAllByFunctionalityId(functionalityService).pipe(
      switchMap((functionalities) => {
        const users = functionalities.map(x => this.taskItemService.getAllByFunctionalityId(x.id));

        return forkJoin(users);
      })
    ).pipe(
      map((tasks) => {
        return tasks.flat();
      })
    ).pipe(switchMap((tasks) => {
      const accountObs = tasks.map(x => this.accountService.getByIdOrDefault(x.assignedUserId));

      return forkJoin(accountObs).pipe(
        defaultIfEmpty([])
      );
    })).pipe(map((x) => {
      return removeDuplicateAccounts(x.filter(x => x != null) as Account[]);
    }));

    const owner = this.getOwner(functionalityService).pipe(map(
      x => [ x ]
    ));

    const combinedObservable = zip(byTask, owner).pipe(
      map(([array1, array2]) => {
        return [...array1, ...array2]
      })
    );

    return combinedObservable;
  }

  private getAllFromLocalStorage(): Functionality[] {
    const entitiesJson = localStorage.getItem(this.storageKey);
    return entitiesJson ? JSON.parse(entitiesJson) : [];
  }

  private saveAllToLocalStorage(entities: Functionality[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(entities));
  }
}
function removeDuplicateAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account, index, self) =>
      index === self.findIndex((a) => (
        a.id === account.id
      ))
  );
}
