import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { promise } from 'protractor';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean>
    {
      return new Promise(resolve => {
        this.authService.getAuth().onAuthStateChanged(user => {
          if (user)
        {
          this.router.navigate(['stream']);
        }

          resolve (!user ? true : false);
        });
      });
    }
}
