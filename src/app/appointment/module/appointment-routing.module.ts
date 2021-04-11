import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DoctorChooseComponent} from '../doctor-choose/doctor-choose.component';
import {AppointmentCreateComponent} from '../appointment-create/appointment-create.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: DoctorChooseComponent},
      {path: 'create/:id', component: AppointmentCreateComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule {}
