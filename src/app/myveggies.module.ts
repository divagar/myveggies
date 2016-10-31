import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routing, myveggiesRoutingProviders } from './myveggies.routing';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home.component';
import { MyVeggiesComponent } from './myveggies.component';


// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyB63VgD0hJpvuOs4rfQYtI9XeB_UIYv2YA",
  authDomain: "myveggies-6f267.firebaseapp.com",
  databaseURL: "https://myveggies-6f267.firebaseio.com",
  storageBucket: "myveggies-6f267.appspot.com"
};

@NgModule({
  declarations: [
    MyVeggiesComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [
    myveggiesRoutingProviders,
    HomeComponent,
    Title
  ],
  bootstrap: [MyVeggiesComponent]
})
export class MyVeggiesModule { }
