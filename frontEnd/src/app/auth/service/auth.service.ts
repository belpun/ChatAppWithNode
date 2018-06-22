import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ng-socket-io';

@Injectable()
export class AuthService {

  BASE_URL = 'http://bita-lpt24:3000/auth';
  TOKEN_KEY = 'token';
  NAME_KEY = 'name';
  EMAIL_KEY = 'email';

  constructor(private http: HttpClient, private router: Router, private socket: Socket, private sb: MatSnackBar) { }


  register(user) {
    delete user.confirmPassword;

    this.http.post(this.BASE_URL + '/register', user).subscribe(res => {
      this.authenticate(res);

    });
  }

  get name() {
    return localStorage.getItem(this.NAME_KEY);
  }


  get isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }


  // get tokenHeader(): HttpHeaders {
  //   const header = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)});
  //   return header;
  // }

  logout() {

    this.socket.emit('logout', {email: localStorage.getItem(this.EMAIL_KEY)}, (data) => {

      if (!data.success) {
       this.sb.open(data.message, 'close',  {duration: 2000});
       localStorage.removeItem(this.TOKEN_KEY);
       localStorage.removeItem(this.NAME_KEY);
       localStorage.removeItem(this.EMAIL_KEY);
      }

      // this.authenticate(data);
    });


    this.router.navigate(['/login']);
  }

  login(loginData: any): any {

    this.socket.emit('login', loginData, (data) => {

      if (!data.success) {
       this.sb.open(data.message, 'close',  {duration: 2000});
      }

      this.authenticate(data);
    });

  }


  authenticate(res) {
    const authResponse = res;
    if (!authResponse['token']) {
      return;
    }

    localStorage.setItem(this.TOKEN_KEY, authResponse['token'] as string);
    localStorage.setItem(this.NAME_KEY, authResponse['firstName'] as string);
    localStorage.setItem(this.EMAIL_KEY, authResponse['email'] as string);
    this.router.navigate(['/chat']);
  }

  getUser() {
    return this.http.get(this.BASE_URL + '/users/me',
     {headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem(this.TOKEN_KEY)})});
  }

}
