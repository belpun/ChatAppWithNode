import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form ;
  constructor( private fb: FormBuilder, private authService: AuthService) {

    this.form = fb.group ({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, matchEmail()]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {validator: matchingField('password', 'confirmPassword')});
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.form.value);
    this.authService.register(this.form.value);
  }


  isValid(control) {
    return this.form.controls[control].invalid && this.form.controls[control].touched;
  }



}

function matchingField(field1, field2) {
  return form => {
    if (form.controls[field1].value !== form.controls[field2].value) {
      return { mismatchField : true};
    }
  };
}

function matchEmail () {
  return control => {
    // tslint:disable-next-line:max-line-length
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(control.value) ? null : {invalidEmail: true};
  };
}
