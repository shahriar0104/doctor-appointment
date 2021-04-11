import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './appointment/module/appointment.module#AppointmentModule'},
  {path: 'home', loadChildren: './appointment/module/appointment.module#AppointmentModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
