import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { EventsService } from '../../services/events.service';
import { ChartEvent, Row } from '../../shared/interfaces';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Output() showInfo = new EventEmitter<any>();

  public currentEvent: ChartEvent;
  public chartEvents: ChartEvent[];
  public timeline = [];

  public cellWidthInPx: number = 50;
  public Math: any;

  public rows: Row[] = [
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
    this.eventsService.getEvents().subscribe((response: ChartEvent[]) => {
      if (response) {
        this.chartEvents = response.map((chartEvent, i) => {
          if (i === 0) {
            chartEvent.start = 0;
          } else {
            chartEvent.start = response[i - 1].start + response[i - 1].duration;
          }

          chartEvent.init_duration = chartEvent.duration;
          chartEvent.init_start = chartEvent.start;

          chartEvent.row_number = this.rows.findIndex(
            (row) => row.value === chartEvent.type,
          );

          return chartEvent;
        });
      }
    });
  }

  public showAdditionalInformation(chartEvent: ChartEvent): void {
    if (this.currentEvent) {
      this.currentEvent.start = this.currentEvent.init_start;
      this.currentEvent.duration = this.currentEvent.init_duration;
    }

    this.currentEvent = chartEvent;
    this.setTime();
    // TODO Здесь будет емит события на показ нижней части
    // this.showInfo.emit(chartEvent)
  }

  public changeRange(e, isMax?: boolean): void {
    if (!this.currentEvent) {
      return;
    }

    const value = parseInt(e.target.value);

    if (isMax) {
      if (
        this.currentEvent.duration > 1 ||
        (this.currentEvent.duration <= 1 && value > this.currentEvent.start)
      ) {
        this.currentEvent.duration = value - this.currentEvent.start;
      } else {
        this.currentEvent.start > this.currentEvent.init_start
          ? this.currentEvent.start--
          : this.currentEvent.duration++;
      }
    } else {
      if (this.currentEvent.duration <= 1 && value > this.currentEvent.start) {
        this.currentEvent.duration = this.currentEvent.start - value;
      }

      this.currentEvent.duration += this.currentEvent.start - value;
      this.currentEvent.start = value;
    }

    this.setTime();
  }

  private setTime(): void {
    if (!this.currentEvent) {
      return;
    }

    this.currentEvent.start_time = moment()
      .startOf('day')
      .add(this.currentEvent.start, 'minutes');
    this.currentEvent.end_time = moment()
      .startOf('day')
      .add(this.currentEvent.start + this.currentEvent.duration, 'minutes');
  }

  public saveNewValues(): void {
    this.currentEvent = null;
  }
}
