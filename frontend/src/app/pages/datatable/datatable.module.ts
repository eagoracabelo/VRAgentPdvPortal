import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DatatablesRoutingModule } from './datatable-routing.module';
import { DatatableComponent } from './datatable.component';

@NgModule({
  declarations: [DatatableComponent],
  imports: [CommonModule, DatatablesRoutingModule],
})
export class DatatableModule {}
