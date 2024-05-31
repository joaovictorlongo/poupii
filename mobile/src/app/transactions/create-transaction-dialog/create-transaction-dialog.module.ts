import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CreateTransactionDialogComponent } from './create-transaction-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [CreateTransactionDialogComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyDirective
  ]
})
export class CreateTransactionDialogModule { }
