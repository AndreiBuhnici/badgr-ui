
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class ApprovePermissionGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
    const token = this.session.currentAuthToken;
    const scope = token && token.scope ? String(token.scope) : '';
    const hasApproveScope = scope.includes('rw:approve');

    if (!hasApproveScope) {
      return this.router.parseUrl('/');
    }

    return true;
  }
}