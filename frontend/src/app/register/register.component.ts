import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConstants';
import { OwnersService } from '../services/owners.service';

import { CheckPasswordService } from './../services/check-password.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide: unknown;
  payload = {};
  registerForm: FormGroup = new FormGroup({});
  email: any;

  constructor(private fb: FormBuilder, private checkP: CheckPasswordService, private router: Router, private owners: OwnersService) {}

  ngOnInit(): void {
    this.createRegistrationForm();
  }

  createRegistrationForm(): void {
    this.registerForm = this.fb.group(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl ('', [Validators.required, Validators.email]),
        password: new FormControl ('', [Validators.required, Validators.minLength(6)]),
        passwordConfirm: new FormControl ('', [Validators.required, Validators.maxLength(12)])
      },
      {
        validator: this.checkP.passwordMatchValidator(
          'password',
          'passwordConfirm'
        )
      }
    );
  }

  onRegister(): void {
    this.payload = Object.assign(this.payload, this.registerForm.value);
    const message = 'Congratulations ' + this.registerForm.get( 'name' )?.value + '! You are the new user of the mHealthRecords platform! 😎 ';
    axios.post(
      API_BASE_URL + 'auth/register', this.payload).then(
          (response) => {
            if (response.status === 200) {
            // console.log('Registration successful!' + response);
            this.router.navigate(['']);
            }else if (response.status === 204) {
              console.log('Error 1');
            } else {
              console.log('Error 2');
            }
          }
      ).catch( (error) => {
        console.log(error);
      });
    this.sendEmail(this.registerForm.get( 'email' )?.value, this.registerForm.get( 'name' )?.value, message);
    this.registerForm.reset();
  }
  public sendEmail(Email: any, Name: any, Message: any): void {
    const user = {
      // tslint:disable-next-line:object-literal-shorthand
      Email: Email,
      // tslint:disable-next-line:object-literal-shorthand
      Name: Name,
      // tslint:disable-next-line:object-literal-shorthand
      Message: Message
    };
    this.owners.sendEmail(API_BASE_URL + 'sendEmail', user).subscribe(
      data => {

        const res: any = data;
        console.log('Email has been sent!!! 😎');
      },

      err => {
        console.log(err);
      }, () => {
        console.log('Then, other functions.....');
      }
    );
  }
}
