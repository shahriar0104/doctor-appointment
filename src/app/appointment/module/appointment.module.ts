import {NgModule} from '@angular/core';
import {DoctorChooseComponent} from '../doctor-choose/doctor-choose.component';
import {AppointmentCreateComponent} from '../appointment-create/appointment-create.component';
import {SharedModule} from '../../shared/module/shared.module';
import {AppointmentRoutingModule} from './appointment-routing.module';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';

@NgModule({
  declarations: [DoctorChooseComponent, AppointmentCreateComponent],
    imports: [
        SharedModule,
        AppointmentRoutingModule,
        AngularMyDatePickerModule
    ],
  exports: [DoctorChooseComponent, AppointmentCreateComponent]
})
export class AppointmentModule {}
