import { Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginHero } from '../../components/login-hero/login-hero';

@Component({
  imports: [LoginForm, LoginHero],
  selector: 'app-login-page',
  styleUrl: './login-page.scss',
  templateUrl: './login-page.html',
})
export class LoginPage {}
