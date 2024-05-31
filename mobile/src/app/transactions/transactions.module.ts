import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsPage } from './transactions.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TransactionsPageRoutingModule } from './transactions-routing.module';
import { CreateTransactionDialogModule } from './create-transaction-dialog/create-transaction-dialog.module';
import { TransactionsService } from '../services/data/transactions.service';
import { EditTransactionDialogModule } from './edit-transaction-dialog/edit-transaction-dialog.module';
import { DeleteTransactionDialogModule } from './delete-transaction-dialog/delete-transaction-dialog.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TransactionsPageRoutingModule,
    CreateTransactionDialogModule,
    EditTransactionDialogModule,
    DeleteTransactionDialogModule
  ],
  declarations: [TransactionsPage],
  providers: [TransactionsService]
})
export class TransactionsPageModule {}
