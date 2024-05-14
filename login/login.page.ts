import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
  }
  async login() {
    try {
      // get stored password using the entered username as the key
      const storedPassword = await Preferences.get({ key: this.username });
      
      // Check if stored password matches the entered password
      if (storedPassword.value === this.password) {
          // Set the current username as the active user
          await Preferences.set({ key: 'activeUser', value: this.username });
          // Redirect to the home page
          this.router.navigate(['/home']);
      } else {
        await this.presentErrorAlert();
          console.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
        console.error('Error retrieving password:', error);
    }
  }
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Login Error',
      message: 'Incorrect username or password',
      buttons: ['OK']
    });

    await alert.present();
  }
}
