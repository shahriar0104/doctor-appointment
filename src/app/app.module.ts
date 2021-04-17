import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AppointmentModule} from './appointment/module/appointment.module';
import {FormsModule} from '@angular/forms';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {PageNotFoundComponent} from './shared/components/page-not-found/page-not-found.component';
import {CoreModule} from './core/core.module';
import {EffectsModule} from '@ngrx/effects';
import * as fromApp from './store/app.reducer';
import {StoreModule} from '@ngrx/store';
import {DoctorEffects} from './appointment/doctor-choose/store/doctor-choose.effects';

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
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([DoctorEffects]),
    CoreModule,
    AppointmentModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
