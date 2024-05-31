import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import gql from 'graphql-tag';
import { Transactions } from 'src/app/transactions/transactions.type';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  transactions: Transactions;

  constructor(private apollo: Apollo) {
    this.transactions = {
      totalRevenue: 0,
      totalExpense: 0,
      totalBalance: 0,
      transactions: []
    }
  }

  createTransaction(createTransactionInput: { amount: number, description: string, type: string, transactionDate: string, userId: string }) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createTransaction($createTransactionInput: CreateTransactionInput!) {
          createTransaction(createTransactionInput: $createTransactionInput) {
            id,
            amount,
            description,
            type,
            transactionDate,
            userId,
            user {
              id,
              firstName,
              lastName,
              email
            }
          }
        }
      `,
      variables: {
        createTransactionInput
      }
    })
  }

  updateTransaction(updateTransactionInput: { id: string, amount: number, description: string, type: string, transactionDate: string }) {
    return this.apollo.mutate({
      mutation: gql`
        mutation updateTransaction($updateTransactionInput: UpdateTransactionInput!) {
          updateTransaction(updateTransactionInput: $updateTransactionInput) {
            id,
            amount,
            description,
            type,
            transactionDate,
            userId,
            user {
              id,
              firstName,
              lastName,
              email
            }
          }
        }
      `,
      variables: {
        updateTransactionInput
      }
    })
  }

  removeTransaction(id: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation removeTransaction($id: String!) {
          removeTransaction(id: $id)  {
            id,
            amount,
            description,
            type,
            transactionDate,
            userId,
            user {
              id,
              firstName,
              lastName,
              email
            }
          }
        }
      `,
      variables: {
        id
      }
    })
  }
}
