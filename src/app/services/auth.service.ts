import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afa: AngularFireAuth) { }

  login(user: User)
  {
    return this.afa.signInWithEmailAndPassword(user.email, user.password);
  }
  register(user: User)
  {
    return this.afa.createUserWithEmailAndPassword(user.email, user.password);
  }

  logout()
  {
    this.getAuth().signOut();
  }

  getAuth()
  {
    return this.afa;
  }
}
