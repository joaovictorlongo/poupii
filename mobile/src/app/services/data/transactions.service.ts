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
      transactions: {
        totalRevenue: 0,
        totalExpense: 0,
        totalBalance: 0,
        transactions: []
      }
    }
  }

  getTransactions(selectTransactionInput: { from: string, to: string }) {
    return this.apollo.query({
      query: gql`
        query transactions($selectTransactionInput: SelectTransactionInput) {
          transactions(selectTransactionInput: $selectTransactionInput) {
            totalRevenue,
            totalExpense,
            totalBalance,
            transactions {
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
        }
      `,
      variables: {
        selectTransactionInput
      }
    })
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
}
