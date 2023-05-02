import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProjectDtoContract} from "../contracts/projectDtoContract";
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


  public createProject(dto : ProjectDtoContract) : Observable<any> {
    return this.httpClient.post(this.baseEndpoint, dto);
  }

  public updateProject(id : string, dto : ProjectDtoContract) : Observable<any> {
    return this.httpClient.put(urlJoin(this.baseEndpoint, id), dto);
  }

  public getProject(id : string): Observable<any> {
    return this.httpClient.get(urlJoin(this.baseEndpoint, id));
  }
  public getProjects(): Observable<any> {
    return this.httpClient.get(this.baseEndpoint);
  }
}
