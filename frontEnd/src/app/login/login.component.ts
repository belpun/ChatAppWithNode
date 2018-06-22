import { AuthService } from './../auth/service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  loginData = {
    email: '',
    password: ''
  };

  ngOnInit() {
  }

  login() {
    console.log(this.loginData);
    this.authService.login(this.loginData);
  }

}
