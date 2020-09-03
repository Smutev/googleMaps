import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {LayoutComponent} from "./layout.component";
import {ChartModule} from "../chart/chart.module";
import {MapModule} from "../map/map.module";

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, ChartModule, MapModule],
})
export class LayoutModule {}
