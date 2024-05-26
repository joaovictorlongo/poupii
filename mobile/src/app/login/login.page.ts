import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NewAccountComponent } from './new-account/new-account.component';
import { NewAccountService } from '../services/new-account.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(private modalController: ModalController, private newAccountService: NewAccountService, private toastController: ToastController) {}

  loginForm: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'password': new FormControl(null, Validators.required)
  });

  async onLogin() {
    console.log(this.loginForm.value);
  }

  async openNewAccountModal() {
    const modal = await this.modalController.create({
      component: NewAccountComponent,
      backdropDismiss: false
    });

    modal.present();

    const { data: newAccount, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      delete newAccount.passwordConfirmation;
      this.newAccountService.createAccount(newAccount).subscribe({
        next: async ({ data }) => {
          const toast = await this.toastController.create({
            message: 'Conta criada com sucesso! Faça login para continuar.',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          toast.present();
        },
        error: async (error) => {
          console.error('Erro ao criar a conta:', error);
          const toast = await this.toastController.create({
            message: 'Erro ao criar a conta. Por favor, tente novamente.',
            duration: 2000,
            position: 'bottom',
            color: 'danger'
          });
          toast.present();
        }
      });
    }
  }
}
