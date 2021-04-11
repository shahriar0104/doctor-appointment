import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppointmentService} from '../appointment/services/appointment.service';
import {NetworkService} from '../shared/services/network.service';
import {NetworkInterceptor} from '../shared/services/network-interceptor.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AppointmentService,
    NetworkService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
}
