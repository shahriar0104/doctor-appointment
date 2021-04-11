import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HeaderModule} from '../../header/header.module';
import {PaginationModule} from '../components/pagination/pagination.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NetworkInterceptor} from '../services/network-interceptor.service';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    HeaderModule,
    PaginationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NetworkInterceptor,
      multi: true
    }
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HeaderModule,
    PaginationModule
  ]
})
export class SharedModule {
}
