import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import gql from 'graphql-tag';
import { NewAccount } from '../../login/new-account/new-account.type';
import { Observable } from 'rxjs';
import { GraphQLError } from 'graphql';

export interface NewAccountResponse {
  createUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apollo: Apollo) { }

  createAccount(createUserInput: NewAccount): Observable<MutationResult<NewAccountResponse>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation createAccount($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            id
            firstName
            lastName
            email
          }
        }
      `,
      variables: {
        createUserInput
      }
    });
  }

  loginUser(loginUserInput: { email: string, password: string }) {
    return this.apollo.mutate({
      mutation: gql`
        mutation loginUser($loginUserInput: LoginUserInput!) {
          loginUser(loginUserInput: $loginUserInput) {
            token
          }
        }
      `,
      variables: {
        loginUserInput
      }
    });
  }

  validateToken() {
    const token = localStorage.getItem('p') || '';
    return this.apollo.mutate({
      mutation: gql`
        mutation validateToken($token: String!) {
          validateToken(token: $token)
        }
      `,
      variables: {
        token
      }
    })
  }

  setToken(token: string) {
    localStorage.setItem('p', token)
  }
}
