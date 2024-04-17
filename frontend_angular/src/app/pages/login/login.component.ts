import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isSignDivVisiable: boolean = true;
  signUpObj: SignUpModel = new SignUpModel();
  loginObj: LoginModel = new LoginModel();

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    this.authService.register(this.signUpObj).subscribe({
      next: (response) => {
        alert('Registration Success');
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        alert('Registration Failed');
        console.error(error);
      }
    });
  }

  onLogin() {
    this.authService.login(this.loginObj).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        console.log('Token:', response.token);
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        alert("No User Found");
        console.error(error);
      }
    });
  }
}

export class SignUpModel {
  name!: string;
  email!: string;
  password!: string;
}

export class LoginModel {
  email!: string;
  password!: string;
}
