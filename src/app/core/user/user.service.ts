import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './user';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User>(null);
  private userName: string;

  constructor(private tokenService: TokenService) {
    if(this.tokenService.hasToken())
      this.decodeAndNotify();
  }

  setToken(token: string){
    this.tokenService.setToken(token);
    this.decodeAndNotify();
  }

  getUser(){
    return this.userSubject.asObservable();
  }

  getUserName(){
    return this.userName;
  }

  private decodeAndNotify(){
    const token = this.tokenService.getToken();
    const user = jwt_decode(token) as User;
    this.userName = user.name;
    this.userSubject.next(user);
  }

  isLogged(){
    return this.tokenService.hasToken();
  }

  logout(){
    this.tokenService.removeToken();
    this.userSubject.next(null);
  }
}
