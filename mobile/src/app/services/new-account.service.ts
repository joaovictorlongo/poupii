import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { NewAccount } from '../login/new-account/new-account.type';

@Injectable({
  providedIn: 'root'
})
export class NewAccountService {

  constructor(private apollo: Apollo) { }

  createAccount(createUserInput: NewAccount) {
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
}
