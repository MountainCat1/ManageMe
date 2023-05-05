import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {Account, AccountRole} from "../entities/account";
import {TaskItemService} from "./task-item.service";
import {v4 as uuidv4} from 'uuid';
export interface AccountCreate {
  username: string;
  name: string;
  surname: string;
  password: string;
  role: AccountRole;
}
export interface AccountUpdate {
  id: string;
  name: string;
  surname: string;
  role: AccountRole;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly storageKey = 'accounts';
  private static initialized = false;
  constructor(private cookieService : CookieService,
              private taskItemService : TaskItemService,) {
    this.getByUsernameOrDefault('admin').subscribe({
      next: value => {
        if(value == null) {
          console.log('Initializing admin user...')
          this.create({
            role: AccountRole.Admin,
            name: "admin",
            username: "admin",
            surname: "",
            password: "admin"
          });
        }
      }
    })
  }

  getAllTaskItems(accountId : string) {
    return this.taskItemService.getAllByAssignedUserId(accountId);
  }

  getByUsername(username: string): Observable<Account> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson) as Account[] : [];
    const account = accounts.find(a => a.username === username);

    if(account == null)
      throw new Error(`Account with username '${username}' not found`);

    return of(account);
  }

  getByUsernameOrDefault(username: string): Observable<Account | undefined> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson) as Account[] : [];
    const account = accounts.find(a => a.username === username);

    return of(account);
  }


  getMyAccount(): Observable<Account | undefined> {
    const id = this.cookieService.get('auth_token');

    if(id == null || id == "")
      return of(undefined);

    return this.getById(id);
  }

  getAll(): Observable<Account[]> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson) as Account[] : [];
    return of(accounts);
  }

  getById(id: string): Observable<Account> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson)  as Account[] : [];
    const account = accounts.find(a => a.id === id);

    if(account == null)
      throw new Error()

    return of(account);
  }

  getByIdOrDefault(id: string): Observable<Account | undefined> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson)  as Account[] : [];
    const account = accounts.find(a => a.id === id);

    if(account == null)
      return of(undefined);

    return of(account);
  }

  create(accountCreate: AccountCreate): Observable<Account> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson) : [];

    const account: Account = {
      ...accountCreate,
      id: uuidv4(),
    };

    accounts.push(account);
    localStorage.setItem(this.storageKey, JSON.stringify(accounts));
    return of(account);
  }

  update(update: AccountUpdate): Observable<void> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson) as Account[] : [];
    const index = accounts.findIndex(a => a.id === update.id);
    if (index === -1) {
      throw new Error(`Account with id '${update.id}' not found`);
    }
    accounts[index] = {...accounts[index], ...update};
    localStorage.setItem(this.storageKey, JSON.stringify(accounts));
    return of(void 0);
  }

  delete(id: string): Observable<void> {
    const accountsJson = localStorage.getItem(this.storageKey);
    const accounts = accountsJson ? JSON.parse(accountsJson) as Account[] : [];
    const index = accounts.findIndex(a => a.id === id);
    accounts.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(accounts));
    return of(void 0);
  }
}


