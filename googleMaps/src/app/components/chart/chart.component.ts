import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import { EventsService } from '../../services/events.service';
import { ChartEvent } from '../../shared/interfaces';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Output() showInfo = new EventEmitter<any>();

  public cellWidthInPx = 50;
  public Math: any;
  public rows = [
    {
      name: 'Off Duty',
      value: 'OFF',
      cell_reverse: false,
      color: 'red',
    },
    {
      name: 'Sleeper Berth',
      value: 'SB',
      cell_reverse: false,
      color: 'blue',
    },
    {
      name: 'Driving',
      value: 'D',
      cell_reverse: true,
      color: 'green',
    },
    {
      name: 'On Duty',
      value: 'ON',
      cell_reverse: true,
      color: 'violet',
    },
  ];

  public timeline = [];
  public chartEvents: ChartEvent[];

  constructor(private eventsService: EventsService) {
    this.Math = Math;
  }

  public ngOnInit(): void {
    this.getTimeline();
    this.getChartEvents();
  }

  public getTimeline() {
    let currentDate = moment('12');
    // @ts-ignore
    new Array(25).fill().map(() => {
      this.timeline.push({
        hour: currentDate.format('h'),
        format: currentDate.format('A'),
      });
      currentDate = currentDate.add(1, 'hour');
    });
  }

  public getChartEvents(): void {
    this.eventsService.getEvents().subscribe((response) => {
      if (response) {
      const startOfTheDay = moment()
          .utc()
          .local()
          .startOf('day');

        this.chartEvents = response.map(chartEvent => {
          chartEvent.spent_minutes = chartEvent.end_time.diff(chartEvent.start_time, 'minutes');
          chartEvent.minutes_from_day_start = chartEvent.start_time.diff(startOfTheDay, 'minutes');
          chartEvent.row_number = this.rows.findIndex(row => row.value === chartEvent.type);
          return chartEvent;
        });
      }
    });
  }

  public showAdditionalInformation(chartEvent): void {
    console.log(chartEvent);


    // TODO Здесь будет емит события на показ нижней части
    // this.showInfo.emit(chartEvent)
  }
}
