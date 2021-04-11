import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', loadChildren: './appointment/module/appointment.module#AppointmentModule'},
  {path: 'home', loadChildren: './appointment/module/appointment.module#AppointmentModule'},
  // shared
  {path: 'error', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/error'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
