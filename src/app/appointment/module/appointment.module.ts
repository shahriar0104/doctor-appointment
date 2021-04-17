import {NgModule} from '@angular/core';
import {DoctorChooseComponent} from '../doctor-choose/doctor-choose.component';
import {AppointmentCreateComponent} from '../appointment-create/appointment-create.component';
import {SharedModule} from '../../shared/module/shared.module';
import {AppointmentRoutingModule} from './appointment-routing.module';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {LoadingBarModule} from '@ngx-loading-bar/core';

@NgModule({
  declarations: [DoctorChooseComponent, AppointmentCreateComponent],
  imports: [
    SharedModule,
    AppointmentRoutingModule,
    AngularMyDatePickerModule,
    LoadingBarModule
  ],
  exports: [DoctorChooseComponent, AppointmentCreateComponent]
})
export class AppointmentModule {
}
