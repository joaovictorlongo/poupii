import { Component, OnInit } from '@angular/core';
import { Transactions } from './transactions.type';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { endOfMonth, format, formatISO, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale'
import gql from 'graphql-tag';
import { ModalController } from '@ionic/angular';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { CreateTransactionDialogComponent } from './create-transaction-dialog/create-transaction-dialog.component';
import { TransactionsService } from '../services/data/transactions.service';
import { EditTransactionDialogComponent } from './edit-transaction-dialog/edit-transaction-dialog.component';
import { DeleteTransactionDialogComponent } from './delete-transaction-dialog/delete-transaction-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: 'transactions.page.html',
  styleUrls: ['transactions.page.scss']
})
export class TransactionsPage implements OnInit {
  selectTransactionInput: {
    from: string;
    to: string;
  }
  transactions: Transactions;
  private querySubscription: Subscription;
  private transactionQuery: QueryRef<any>;

  constructor(private apollo: Apollo, private modalController: ModalController, private transactionsService: TransactionsService) {
    this.querySubscription = new Subscription();
    this.selectTransactionInput = {
      from: formatISO(startOfMonth(new Date())),
      to: formatISO(endOfMonth(new Date()))
    }
    this.transactions = {
      totalRevenue: 0,
      totalExpense: 0,
      totalBalance: 0,
      transactions: []
    }
    this.transactionQuery = this.apollo.watchQuery<any>({
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
        },
      `,
      variables: {
        selectTransactionInput: this.selectTransactionInput
      }
    });
  }

  ngOnInit() {
    this.querySubscription = this.transactionQuery.valueChanges.subscribe(({ data }) => {
      this.transactions = data.transactions;
    });
  }

  async openDateFilter() {
    const modal = await this.modalController.create({
      component: DateFilterComponent,
      backdropDismiss: true,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      keyboardClose: true
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      const selectTransactionInput = {
        from: data.from,
        to: data.to
      }
      this.transactionQuery.setVariables({
        selectTransactionInput: selectTransactionInput
      });
      this.transactionQuery.refetch();
    }
  }

  async openCreateTransactionDetail() {
    const modal = await this.modalController.create({
      component: CreateTransactionDialogComponent,
      componentProps: {
        transaction: {
          id: '',
          amount: 0,
          description: '',
          type: 'EXPENSE',
          transactionDate: format(new Date(), 'yyyy-MM-dd', { locale: ptBR })
        },
      },
      backdropDismiss: false,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      this.transactionsService.createTransaction(data).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.transactionQuery.setVariables({
              selectTransactionInput: this.selectTransactionInput
            });
            this.transactionQuery.refetch();
          }
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
        }
      });
    }

    modal.dismiss();
  }

  async openUpdateTransactionDetail(transaction: any) {
    const modal = await this.modalController.create({
      component: EditTransactionDialogComponent,
      componentProps: {
        transaction: transaction,
      },
      backdropDismiss: false,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      data.id = transaction.id;
      this.transactionsService.updateTransaction(data).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.transactionQuery.setVariables({
              selectTransactionInput: this.selectTransactionInput
            });
            this.transactionQuery.refetch();
          }
        },
        error: (error) => {
          console.error('Error updating transaction:', error);
        }
      });
    }

    modal.dismiss();
  }

  async openDeleteTransactionDetail(transaction: any) {
    const modal = await this.modalController.create({
      component: DeleteTransactionDialogComponent,
      componentProps: {
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          description: transaction.description,
          type: transaction.type,
          transactionDate: format(new Date(transaction.transactionDate), 'yyyy-MM-dd', { locale: ptBR })
        },
      },
      backdropDismiss: false,
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.75, 1],
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();
    console.log('data', data)

    if (role === 'confirm') {
      this.transactionsService.removeTransaction(data.id).subscribe({
        next: (response: any) => {
          if (response && response.data) {
            this.transactionQuery.setVariables({
              selectTransactionInput: this.selectTransactionInput
            });
            this.transactionQuery.refetch();
          }
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        }
      });
    }

    modal.dismiss();
  }
}
