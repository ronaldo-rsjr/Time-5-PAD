import { AuthPage } from './../auth/auth.page';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { on } from 'process';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  public nome: string;
  constructor(
    public authService: AuthService,
    public toastCtrl: ToastController, 
  ) {}

  async ionViewWillEnter()
  {
    if (AuthPage.isRegister)
    {
      this.nome = AuthPage.UserRegister.name;
    }
    else
    {
      this.nome = (await((await this.authService.getAuth().currentUser).displayName));
    }
  }

  logout()
  {
    this.authService.logout();
  }

  async displayname()
  {
    this.presentToast(await((await this.authService.getAuth().currentUser).displayName));
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({message, duration: 8000});
    return toast.present();
  }
}
