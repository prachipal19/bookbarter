import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  loggedUser: any;

  constructor(private router: Router) {
    this.loadUser();
  }

  loadUser() {
    const localUser = localStorage.getItem('loggedUser');
    if (localUser != null) {
      this.loggedUser = JSON.parse(localUser);
    }
  }

  onLogoff() {
    // Remove the user info from localStorage
    localStorage.removeItem('loggedUser');
    // Additionally remove the JWT token if stored
    localStorage.removeItem('jwtToken'); // Adjust the key if needed

    // Clear any other related state (if your app requires it)
    // this.authService.clearSession(); // Uncomment if you have a service handling session

    // Navigate back to the login or home page
    this.router.navigateByUrl('/login');
  }
}
