import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { endOfMonth, startOfMonth, format, formatISO } from 'date-fns';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  firstDayOfMonth: String;
  lastDayOfMonth: String;

  dateFilterForm: FormGroup = new FormGroup({
    'from': new FormControl(null, Validators.required),
    'to': new FormControl(null, Validators.required)
  });

  constructor(private modalCtrl: ModalController) {
    this.firstDayOfMonth = formatISO(startOfMonth(new Date()), { representation: 'date' });
    this.lastDayOfMonth = formatISO(endOfMonth(new Date()), { representation: 'date' });
    this.dateFilterForm.patchValue({
      'from': this.firstDayOfMonth,
      'to': this.lastDayOfMonth
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const filters = {
      from: formatISO(new Date(this.dateFilterForm.value.from)),
      to: formatISO(new Date(this.dateFilterForm.value.to))
    }
    return this.modalCtrl.dismiss(filters, 'confirm');
  }
}
