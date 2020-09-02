import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { EventsService } from '../../services/events.service';
import { ChartEvent } from '../../shared/interfaces';
import cloneDeep from 'lodash.clonedeep';
import {log} from "util";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Output() showInfo = new EventEmitter<any>();
  @ViewChild('inputLeft') public inputLeft;
  @ViewChild('thumbLeft') public thumbLeft;
  @ViewChild('inputRight') public inputRight;
  @ViewChild('thumbRight') public thumbRight;
  @ViewChild('range') public range;

  public chart = [];
  public startOfTheDay = moment()
    .utc()
    .local()
    .startOf('day');

  public copiedCurrentEvent: ChartEvent;
  public currentEvent: ChartEvent;
  public previousEvent: ChartEvent;
  public nextEvent: ChartEvent;
  public copiedNextEvent: ChartEvent;
  public copiedPreviousEvent: ChartEvent;

  // public thumbLeft;
  // public thumbRight;
  // public range;

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
    this.eventsService.getEvents().subscribe((response: ChartEvent[]) => {
      if (response) {
        this.chartEvents = response.map((chartEvent, i) => {
          // chartEvent.spent_minutes = chartEvent.end_time.diff(
          //   chartEvent.start_time,
          //   'minutes',
          // );
          // chartEvent.minutes_from_day_start = chartEvent.start_time.diff(
          //   this.startOfTheDay,
          //   'minutes',
          // );
          chartEvent.init_duration = chartEvent.duration;
          if (i === 0) {
            chartEvent.start = 0;
          } else {
            chartEvent.start = response[i - 1].start + response[i - 1].duration;
          }
          chartEvent.init_start = chartEvent.start;
          chartEvent.row_number = this.rows.findIndex(
            (row) => row.value === chartEvent.type,
          );
          return chartEvent;
        });
        console.log(this.chartEvents);
      }
    });
  }

  public showAdditionalInformation(
    chartEvent: ChartEvent,
    index: number,
  ): void {
    this.currentEvent = chartEvent;
    this.copiedCurrentEvent = cloneDeep(this.currentEvent);

    if (index !== this.chartEvents.length - 1) {
      this.nextEvent = this.chartEvents[index + 1];
      this.copiedNextEvent = cloneDeep(this.nextEvent);
    }

    if (index !== 0) {
      this.previousEvent = this.chartEvents[index - 1];
      this.copiedPreviousEvent = cloneDeep(this.previousEvent);
    }

    // TODO Здесь будет емит события на показ нижней части
    // this.showInfo.emit(chartEvent)
  }

  public save(): void {}

  public changeRange(e, isMax?: boolean): void {
    if (!this.currentEvent) {
      return;
    }

    const value = +e.target.value;
    const difference = this.currentEvent.spent_minutes - value;

    if (isMax) {
      this.currentEvent.duration = value - this.currentEvent.start;
    } else {
      this.currentEvent.duration += this.currentEvent.start - value;
      this.currentEvent.start = value;
      // let n = this.currentEvent.start - value;
      // this.currentEvent.start = value;
      //   this.currentEvent.duration += n
    }
  }

  public recountTimeSpaces(chartEvent: ChartEvent) {
    chartEvent.spent_minutes = chartEvent.end_time.diff(
      chartEvent.start_time,
      'minutes',
    );
    chartEvent.start = chartEvent.start_time.diff(
      this.startOfTheDay,
      'minutes',
    );
  }
}
