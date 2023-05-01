import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateProjectContract} from "../contracts/CreateProjectContract";
import {environment} from "../../environments/environment";
import urlJoin from "url-join";
import {AuthenticationService} from "./authentication.service";
import {AuthHttpService} from "./auth-http.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseEndpoint : string = 'project';

  constructor(private httpClient : AuthHttpService) { }


  public createProject(dto : CreateProjectContract) : Observable<any> {
    return this.httpClient.post(this.baseEndpoint, dto);
  }
}
