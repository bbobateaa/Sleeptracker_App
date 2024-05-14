import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LogSleepComponent } from './log-sleep.component';



@NgModule({
  declarations: [LogSleepComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class LogSleepModule {}
