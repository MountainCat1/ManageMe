import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import urlJoin from "url-join";
import {HttpClient} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private apiUri = environment.apiEndpoint;

  constructor(private http : HttpClient,
              private authService : AuthenticationService) { }

  public get<T>(path: string): Observable<T> {
    const url = this.createUri(path);

    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    return this.http.get<T>(url, {
      headers: headers
    });
  }

  public post(path: string, data: any): Observable<any> {
    const url = this.createUri(path);

    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    return this.http.post(url, data, {
      headers: headers
    });
  }

  public put(path: string, data: any): Observable<any> {
    const url = this.createUri(path);

    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    return this.http.put(url, data, {
      headers: headers
    });
  }

  public delete(path: string) {
    const url = this.createUri(path);

    const headers = {
      'Authorization': `Bearer ${this.authService.getToken()}`
    }

    return this.http.delete(url, {
      headers: headers
    });
  }

  private createUri(path : string){
    return urlJoin(this.apiUri, path);
  }


}
