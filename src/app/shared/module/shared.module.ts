import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HeaderModule} from '../../header/header.module';
import {PaginationModule} from '../components/pagination/pagination.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HeaderModule,
    PaginationModule
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
