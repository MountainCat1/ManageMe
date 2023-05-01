import { Injectable } from '@angular/core';
import {AuthHttpService} from "./auth-http.service";
import {AccountDto} from "../contracts/dtos/accountDto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly apiPath : string = 'account'

  constructor(private http : AuthHttpService) { }

  public getMyAccount(): Observable<AccountDto> {
    return this.http.get<AccountDto>(`${this.apiPath}`);
  }
}
