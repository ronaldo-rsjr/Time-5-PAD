import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormControl;

  email = 'gerson@gerson.com';
  senha = '123456';
  constructor(public router: Router) { }

  ngOnInit() {
  }

  login()
  {
      this.router.navigateByUrl('home');
  }

}
