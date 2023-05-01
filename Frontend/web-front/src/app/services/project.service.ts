import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateProjectContract} from "../contracts/CreateProjectContract";
import * as http from "http";
import {environment} from "../../environments/environment";
import urlJoin from "url-join";
import {AuthenticationService} from "./authentication.service";
import {AuthHttpService} from "./auth-http.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUri = environment.apiEndpoint;

  constructor(private httpClient : AuthHttpService) { }


  public createProject(name : string){
    const dto : CreateProjectContract = {
      Name: name
    }

    const uri = urlJoin(this.apiUri)

    this.httpClient.post(uri, dto)
  }
}
