import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './main/pages/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //return true;
    if (this.auth.isLoggednIn()) {
      //this.router.navigate(['/apps/dashboards/analytics']);
      return true;
    } else {
      this.router.navigate(['/pages/auth/login']);
      return false;
    }
  }
}
