import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {LayoutComponent} from "./layout.component";
import {ChartModule} from "../chart/chart.module";

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, ChartModule],
})
export class LayoutModule {}
