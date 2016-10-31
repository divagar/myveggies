import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home.component';
import { MyVeggiesComponent } from './myveggies.component';
import { Routes, RouterModule } from '@angular/router';

const myveggiesRoutes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: '', component: HomeComponent
  },
  {
    path: '**', component: HomeComponent
  }
];

export const myveggiesRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(myveggiesRoutes);
