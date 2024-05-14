import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent  implements OnInit {
  constructor(private modalController: ModalController, private alertController: AlertController) {}
	username: string = '';
	newPassword: string = '';
  ngOnInit() {
    this.retrieveUsername();
  }

  async retrieveUsername() {
    // gets current user
    try {
      const { value } = await Preferences.get({ key: 'activeUser' });
      if (value) {
        this.username = value;
        console.log("this.username: ", this.username);
      } else {
        console.log('No username found in storage');
      }
    } catch (error) {
      console.error('Error retrieving username:', error);
    }
  }

  async updatePassword() {
    // updates the password of username
    try {
      await Preferences.set({ key: this.username, value: this.newPassword });
      console.log('Password updated successfully.');
      await this.presentUpdate();
      this.cancel();
    } catch (error) {
        console.error('Error updating username:', error);
    }
  }

  async cancel() {
    // closes the modal
    await this.modalController.dismiss();
  }

  async presentUpdate() {
    // tells user that password has been changed
    const alert = await this.alertController.create({
      header: 'Password Updated',
      message: 'Your password has been succesfully updated',
      buttons: ['Close']
    });

    await alert.present();
  }
}