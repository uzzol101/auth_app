import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService

  ) {}

  ngOnInit() {}

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    this.authService.authenticateUser(user).subscribe(data => {
      if (data.success) { // data coming from server (/login) endpoints res.json
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show("You are now loged in", { cssClass: 'alert-success', timeOut: 3000 });
        this.router.navigate(['/dashboard']);

      } else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeOut: 3000 });
        this.router.navigate(['/login']);
      }
    });
  }

}
