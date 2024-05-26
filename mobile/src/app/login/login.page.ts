import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NewAccountComponent } from './new-account/new-account.component';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private toastController:ToastController,
    private router: Router
  ) {}

  loginForm: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'password': new FormControl(null, Validators.required)
  });

  async onLogin() {
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: async (response: any) => {
        console.log('response', response)
        const token = response && response.data && response.data.loginUser && response.data.loginUser.token;
        this.authService.setToken(token);
        this.router.navigate(['/']);
      },
      error: async (error) => {
        console.error('Erro ao fazer login:', error);
        const toast = await this.toastController.create({
          message: 'Erro ao fazer login. Por favor, tente novamente.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        toast.present();
      }
    });
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
      this.authService.createAccount(newAccount).subscribe({
        next: async (response: any) => {
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
