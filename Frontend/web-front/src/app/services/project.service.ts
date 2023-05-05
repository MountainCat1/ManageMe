import {Injectable} from '@angular/core';
import {defaultIfEmpty, forkJoin, map, Observable, of, switchMap, zip} from "rxjs";
import {v4 as uuidv4} from 'uuid';
import {Project} from "../entities/project";
import {Functionality} from "../entities/functionality";
import {TaskItem} from "../entities/taskItem";
import {TaskItemService} from "./task-item.service";
import {FunctionalityService} from "./functionality.service";
import {AccountService} from "./account.service";
import {Account} from "../entities/account";

export interface ProjectCreate {
  name: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  estimatedTime?: number;
  workHourDone?: number;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly storageKey = 'projects';
  private readonly storageKeyForActiveProjectId = 'active_project';

  constructor(
    private functionalityService: FunctionalityService,
    private taskItemService: TaskItemService,
    private accountService: AccountService
  ) {
  }

  setActiveProject(projectId: string): Observable<null> {
    localStorage.setItem(this.storageKeyForActiveProjectId, projectId);
    return of(null);
  }

  getActiveProject(): Observable<string | undefined> {
    const activatedProjectId = localStorage.getItem(this.storageKeyForActiveProjectId)?.toString();
    return of(activatedProjectId);
  }

  getAll(): Observable<Project[]> {
    const projectsJson = localStorage.getItem(this.storageKey);
    const projects = projectsJson ? JSON.parse(projectsJson) : [];
    return of(projects);
  }

  getById(id: string): Observable<Project> {
    return this.getAll().pipe(
      map((projects: Project[]) => projects.find(p => p.id === id) as Project)
    );
  }

  create(projectCreate: ProjectCreate): Observable<Project> {
    const project: Project = {...projectCreate, id: uuidv4()};
    const projects = this.getStoredProjects();
    projects.push(project);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return of(project);
  }

  update(id: string, projectUpdate: ProjectUpdate): Observable<Project> {
    const projects = this.getStoredProjects();
    const index = projects.findIndex(p => p.id === id);
    const updatedProject = {...projects[index], ...projectUpdate};
    projects[index] = updatedProject;
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return of(updatedProject);
  }


  delete(id: string): Observable<void> {
    const projects = this.getStoredProjects();
    const index = projects.findIndex(p => p.id === id);
    projects.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return of(void 0);
  }

  getAllFunctionalitiesByProjectId(
    projectId: string
  ): Observable<Functionality[]> {
    return this.functionalityService.getByProjectId(projectId);
  }

  getAllTaskItemsByProjectId(projectId: string): Observable<TaskItem[]> {
    const functionalityObservable = this.functionalityService.getByProjectId(
      projectId
    );
    return functionalityObservable.pipe(
      switchMap((functionalities) => {
        const observableArray = functionalities.map((functionality) =>
          this.taskItemService.getAllByFunctionalityId(functionality.id)
        );
        return forkJoin(observableArray).pipe(
          map((taskItems) =>
            taskItems.reduce((acc, curr) => acc.concat(curr), [])
          )
        );
      })
    );
  }

  private getStoredProjects(): Project[] {
    const projectsJson = localStorage.getItem(this.storageKey);
    return projectsJson ? JSON.parse(projectsJson) : [];
  }


  getAssociatedUsers(projectId: string): Observable<(Account | undefined)[]> {

    const byFunctionality = this.functionalityService.getByProjectId(projectId).pipe(
      switchMap((functionalities) => {
        const users = functionalities.map(x => this.functionalityService.getOwner(x.id));

        return forkJoin(users).pipe(
          defaultIfEmpty([]) // emit empty array if accountObs is empty
        );;
      })
    ).pipe(map(x => {
      return removeDuplicateAccounts(x.filter(x => x != null) as Account[]);
    }))

    const byTask = this.functionalityService.getByProjectId(projectId).pipe(
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

    const combinedObservable = zip(byTask, byFunctionality).pipe(

      map(([array1, array2]) => {
        return [...array1, ...array2]
      }),
      map(x => {
        return removeDuplicateAccounts(x);
      })
    );

    return combinedObservable;
  }
}

function removeDuplicateAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account, index, self) =>
      index === self.findIndex((a) => (
        a.id === account.id
      ))
  );
}
