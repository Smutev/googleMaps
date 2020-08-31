import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartComponent } from './chart.component';
import {EventsService} from "../../services/events.service";

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule],
  exports: [
    ChartComponent
  ],
  providers: [EventsService]
})
export class ChartModule {}
