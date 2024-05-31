import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './delete-transaction-dialog.component.html',
  styleUrls: ['./delete-transaction-dialog.component.scss'],
})
export class DeleteTransactionDialogComponent implements OnInit{
  @Input() transaction: {
    id: string;
    amount: number;
    description: string;
    type: string;
    transactionDate: string;
  }

  transactionForm: FormGroup = new FormGroup({
    'amount': new FormControl({value: '', disabled: true}, Validators.required),
    'description': new FormControl({value: '', disabled: true}, Validators.required),
    'type': new FormControl({value: '', disabled: true}, Validators.required),
    'transactionDate': new FormControl({value: '', disabled: true}, Validators.required)
  });

  constructor(private modalCtrl: ModalController) {
    this.transaction = {
      id: '',
      amount: 0,
      description: '',
      type: '',
      transactionDate: ''
    }

  }

  ngOnInit() {
    this.transactionForm.patchValue({
      'amount': this.transaction.amount,
      'description': this.transaction.description,
      'type': this.transaction.type,
      'transactionDate': this.transaction.transactionDate
    });
  }


  confirm() {
    this.modalCtrl.dismiss({ id: this.transaction.id }, 'confirm');
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
