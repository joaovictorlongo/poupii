import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { endOfMonth, format, formatISO, startOfMonth } from 'date-fns';
import { TransactionsService } from '../services/data/transactions.service';
import { Transactions } from '../transactions/transactions.type';
import { TransactionDialogComponent } from '../transactions/transaction-dialog/transaction-dialog.component';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import gql from 'graphql-tag';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  selectTransactionInput: {
    from: string;
    to: string;
  }

  transactions: Transactions;

  private transactionQuery: QueryRef<any>;
  private querySubscription: Subscription;

  constructor(
    private modalController: ModalController,
    private transactionsService: TransactionsService,
    private loadingCtrl: LoadingController,
    private readonly apollo: Apollo
  ) {
    this.querySubscription = new Subscription();
    this.selectTransactionInput = {
      from: formatISO(startOfMonth(new Date())),
      to: formatISO(endOfMonth(new Date()))
    }
    this.transactions = {
      transactions: {
        totalRevenue: 0,
        totalExpense: 0,
        totalBalance: 0,
        transactions: []
      }
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

  ngOnInit(): void {
    this.querySubscription = this.transactionQuery.valueChanges.subscribe({
      next: ({ data, loading }) => {
        if (loading) {
          this.loadingCtrl.create({
            message: 'Carregando...',
            spinner: 'crescent'
          }).then((loadingEl) => {
            loadingEl.present();
          });
        }
        if (data) {
          this.transactions = data;
        }
      },
      error: (error) => {
        console.error('Error fetching transactions:', error);
      }
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

  async openTransactionModal() {
    const modal = await this.modalController.create({
      component: TransactionDialogComponent,
      componentProps: {
        transaction: {
          id: null,
          transactionDate: format(new Date(), 'yyyy-MM-dd'),
          description: '',
          amount: 0,
          type: 'EXPENSE'
        }
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
  }
}
