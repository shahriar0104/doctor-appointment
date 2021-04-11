import {NgModule} from '@angular/core';
import {DoctorChooseComponent} from '../doctor-choose/doctor-choose.component';
import {AppointmentCreateComponent} from '../appointment-create/appointment-create.component';
import {SharedModule} from '../../shared/module/shared.module';
import {AppointmentRoutingModule} from './appointment-routing.module';

@NgModule({
  declarations: [DoctorChooseComponent, AppointmentCreateComponent],
  imports: [
    SharedModule,
    AppointmentRoutingModule
  ],
  exports: [DoctorChooseComponent, AppointmentCreateComponent]
})
export class AppointmentModule {}
