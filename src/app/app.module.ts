import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/module/shared.module';
import {AppointmentModule} from './appointment/module/appointment.module';
import {FormsModule} from '@angular/forms';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {CoreModule} from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularMyDatePickerModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AppointmentModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
