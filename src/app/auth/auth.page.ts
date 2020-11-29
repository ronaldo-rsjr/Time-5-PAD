import { AuthService } from './../services/auth.service';
import { User } from './../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { setIndex } from '@ionic-native/core/decorators/common';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  public wavesPosition: number = 0;
  public wavesDifference: number = 100;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {}

  segmentChanged(event: any)
  {
    if (event.detail.value === 'login')
    {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    }
    else
    {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async login()
  {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error)
    {
      this.presentToast(error.message);
    } finally
    {
      this.loading.dismiss();
    }
  }

  async register()
  {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch (error)
    {
      this.presentToast(error.message);
    } finally
    {
      this.loading.dismiss();
    }
  }

    async presentLoading() {
      this.loading = await this.loadingCtrl.create({message: 'Por favor, aguarde...'});
      return this.loading.present();
    }

    async presentToast(message: string) {
      const toast = await this.toastCtrl.create({message, duration: 8000});
      return toast.present();
    }
}
