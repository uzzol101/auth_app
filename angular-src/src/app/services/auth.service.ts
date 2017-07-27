import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthService {
  authToken: any; // contians jwt token
  user: any;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http) {}

  // make request to server endppoint(/register) with user which will be created  
  registerUser(user) {

    return this.http.post("/register", user, { headers: this.headers }).map(res => {
      return res.json();
    });
  }

  // make request to server endpoint(/login) with user which will be checked in server side
  authenticateUser(user) {
    return this.http.post("/login", user, { headers: this.headers }).map(res => {
      return res.json();
    });
  }

  getProfile() {
    this.loadToken(); // contians retreived jwt token
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken); // send jwt token with authorization header for verification


    // console.log(this.authToken);
    // jwt protected route [protected in server side]

    return this.http.get("/profile", {
      headers: headers
    }).map(res => {
      return res.json();
    });





  }

  // set token and user to localstorage
  storeUserData(token, user) {
    // use id_token as key for localstorage to avoid unexpected error
    localStorage.setItem("id_token", JSON.stringify(
      token));
    localStorage.setItem("user", JSON.stringify(user));
    // this.authToken = token; // token  is created in (/login) endpoint


  }

  // retrive token from localstorage
  loadToken() {
    const token = JSON.parse(localStorage.getItem('id_token'));
    this.authToken = token; // assigned value of token which retrived from localstorage


  }

  // angular 2 jwt Checking Authentication to Hide/Show Elements and Handle Routing
  loggedIn() {
    return tokenNotExpired("id_token"); // set the token name [default is token]
  }
  // clear token and user info
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
