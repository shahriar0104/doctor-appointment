import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HeaderModule} from '../../header/header.module';
import {PaginationModule} from '../components/pagination/pagination.module';
import {HighlightPipe} from '../pipe/highlight.pipe';
import {LoadingBarModule} from '@ngx-loading-bar/core';

@NgModule({
  declarations: [
    HighlightPipe
  ],
  imports: [
    RouterModule,
    CommonModule,
    LoadingBarModule,
    FormsModule,
    HeaderModule,
    PaginationModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HeaderModule,
    PaginationModule,
    HighlightPipe
  ]
})
export class SharedModule {
}
