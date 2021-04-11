import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [RouterModule, CommonModule],
  exports: [HeaderComponent]
})
export class HeaderModule {
}
