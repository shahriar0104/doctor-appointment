import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NetworkInterceptor} from './shared/services/network-interceptor.service';
import {NetworkService} from './shared/services/network.service';
import {SharedModule} from './shared/module/shared.module';
import {AppointmentModule} from './appointment/module/appointment.module';
import {AppointmentService} from './appointment/services/appointment.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    AppointmentModule
  ],
  providers: [
    AppointmentService,
    NetworkService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
