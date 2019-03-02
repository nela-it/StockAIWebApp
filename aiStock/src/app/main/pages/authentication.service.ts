import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { loginUrl, registerUrl, forgotPasswordUrl, resetPasswordUrl } from '../../../appConfig/appconfig'
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  apiUrl: string;
  constructor(private http: HttpClient) { }

  loginCheck(userData): Observable<any> {
    //this.apiUrl = serverUrl + "user/login"; 
    return this.http.post<any>(loginUrl, userData, this.httpOptions).pipe(
      tap((user) => {
        localStorage.setItem('LoggedInUser', user.token);
      }, err => {
        console.log(err);
      })
    );
  }
  registerUser(userData): Observable<any> {
    //this.apiUrl = serverUrl + "user/register"; 
    return this.http.post<any>(registerUrl, userData, this.httpOptions).pipe(
      tap((user) => {
        localStorage.setItem('LoggedInUser', user.token);
        console.log("user data", user)
      }, err => {
        console.log(err);
      })
    );
  }
  emailCheck(email): Observable<any> {
    //this.apiUrl = serverUrl + "user/register"; 
    return this.http.post<any>(forgotPasswordUrl, email, this.httpOptions).pipe(
      tap((user) => {
        console.log("user data", user)
      }, err => {
        console.log(err);
      })
    );
  }
  changePassword(data): Observable<any> {
    //this.apiUrl = serverUrl + "user/register"; 
    return this.http.post<any>(resetPasswordUrl, data, this.httpOptions).pipe(
      tap((user) => {
        console.log("user data", user)
      }, err => {
        console.log(err);
      })
    );
  }
  getToken() {
    return localStorage.getItem('LoggedInUser');
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
}
