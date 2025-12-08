
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class IssuerPermissionGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
    const token = this.session.currentAuthToken;
    const scope = token && token.scope ? String(token.scope) : '';
    const hasIssuerScope = scope.includes('rw:issuer');

    if (!hasIssuerScope) {
      return this.router.parseUrl('/');
    }

    return true;
  }
}