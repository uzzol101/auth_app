import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {}
  logoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }



}
