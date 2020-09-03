import { Component } from '@angular/core';
import { ChartEvent } from '../../shared/interfaces';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public chartEvent: ChartEvent;

  constructor() {}

  public toggleMap(chartEvent): void {
    this.chartEvent = chartEvent;
  }
}
