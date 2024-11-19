import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userRole = this.userService.getUserRole();

    if (userRole === 'ROLE_ADMIN') {
     
      this.router.navigate(['/emploi-list']);
      return false; 
    } else if (userRole === 'ROLE_USER') {
    
      this.router.navigate(['/emploi-simple']);
      return false; 
    } else {
      
      this.router.navigate(['/login']);
      return false; }

   
    return true;
  }
}
