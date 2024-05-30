import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { formatISO } from 'date-fns';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
})
export class TransactionDialogComponent {
  @Input() transaction: {
    id: string;
    amount: number;
    description: string;
    type: string;
    transactionDate: string;
  }

  transactionForm: FormGroup = new FormGroup({
    'amount': new FormControl(null, Validators.required),
    'description': new FormControl(null, Validators.required),
    'type': new FormControl(null, Validators.required),
    'transactionDate': new FormControl(null, Validators.required)
  });

  constructor(private modalCtrl: ModalController) {
    this.transaction = {
      id: '',
      amount: 0,
      description: '',
      type: '',
      transactionDate: ''
    }
    this.transactionForm.patchValue({
      'amount': this.transaction.amount,
      'description': this.transaction.description,
      'type': this.transaction.type,
      'transactionDate': this.transaction.transactionDate
    });
  }


  confirm() {
    this.transactionForm.patchValue({
      transactionDate: formatISO(new Date(this.transactionForm.value.transactionDate))
    })
    this.modalCtrl.dismiss(this.transactionForm.value, 'confirm');
  }

  cancel() {
    this.modalCtrl.dismiss(false, 'cancel');
  }

  setCursorPositionToEnd(inputEl: HTMLInputElement): void {
    const length = inputEl.value.length;
    inputEl.focus();
    inputEl.setSelectionRange(length, length);
  }
}
