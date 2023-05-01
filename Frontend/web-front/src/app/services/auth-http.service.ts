import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import urlJoin from "url-join";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private apiUri = environment.apiEndpoint;

  constructor(private http : HttpClient,
              private authService : AuthenticationService) { }

  public get(path: string): Observable<any> {
    const url = this.createUri(path);

    const headers = {
      'Authorization': `Bearer ${this.authService}`
    }

    return this.http.get(url, {
      headers: headers
    });
  }

  public post(path: string, data: any): Observable<any> {
    const url = this.createUri(path);

    const headers = {
      'Authorization': `Bearer ${this.authService}`
    }

    return this.http.post(url, data, {
      headers: headers
    });
  }

  private createUri(path : string){
    return urlJoin(this.apiUri, path);
  }
}
