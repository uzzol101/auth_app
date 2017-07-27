import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {

  }
  onRegisterSubmit() {
    const user = {

      username: this.username,
      password: this.password

    };


    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show("Please fill out all forms", { cssClass: 'alert-danger', timeOut: 3000 });
      return false;
    } else {
      this.authService.registerUser(user).subscribe(data => {
        if (data.success) {
          this.flashMessage.show("User Registered successfull", { cssClass: 'alert-success', timeOut: 3000 });
          this.username = '';
          this.password = '';

          this.router.navigate(['/login']);

        } else {
          this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeOut: 3000 });
        }
      })
    }


  }




}
