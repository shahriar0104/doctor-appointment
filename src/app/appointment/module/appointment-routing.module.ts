import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DoctorChooseComponent} from '../doctor-choose/doctor-choose.component';
import {AppointmentCreateComponent} from '../appointment-create/appointment-create.component';
import {PageNotFoundComponent} from '../../shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: DoctorChooseComponent},
      {path: 'create/:id', component: AppointmentCreateComponent}
    ]
  },
  {path: 'error', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/error', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule {}
