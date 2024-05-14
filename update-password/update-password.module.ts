import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './update-password.component';



@NgModule({
  declarations: [UpdatePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class UpdatePasswordModule {}