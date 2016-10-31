import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MyVeggiesComponent } from './myveggies.component';

@NgModule({
  declarations: [
    MyVeggiesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [MyVeggiesComponent]
})
export class MyVeggiesModule { }
