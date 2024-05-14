import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DataViewComponent } from './data-view.component';



@NgModule({
  declarations: [DataViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class DataViewModule {}
