import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {
  constructor(private modalController: ModalController, private router: Router) {}
  username: string = '';
	newPassword: string = '';

  ngOnInit() {
    this.retrieveUsername();
  }

  async retrieveUsername() {
    // gets current username
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

  async deleteValue() {
    // deletes all data associated with the account
    try {
      await Preferences.remove({ key: this.username });
      await Preferences.remove({ key: this.username + " data"});
      await Preferences.remove({ key: this.username + "_loggedMood"});
      console.log('Value deleted successfully');
      this.router.navigate(['/login']);
      this.cancel();

    } catch (error) {
      console.error('Error deleting value:', error);
    }
  }

  async cancel() {
    await this.modalController.dismiss();
  }


}
