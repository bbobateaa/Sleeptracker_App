import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings.component';



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class SettingsModule {}
