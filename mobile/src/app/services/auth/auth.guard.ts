import { Injectable } from '@angular/core';
import {  of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { GraphQLError } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.validateToken().subscribe({
      next: () => {
        return of(true);
      },
      error: (error) => {
        error.graphQLErrors.forEach((graphQLError: GraphQLError) => {
          const statusCode = graphQLError.extensions['originalError'] && graphQLError.extensions['originalError']['statusCode']
          if (statusCode && statusCode === 401) {
            localStorage.removeItem('p');
            this.router.navigate(['/login']);
          }
        })
        return of(false);
      }
    })
  }
}
