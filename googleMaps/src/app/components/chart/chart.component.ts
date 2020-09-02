import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';
import { EventsService } from '../../services/events.service';
import { ChartEvent } from '../../shared/interfaces';
import cloneDeep from 'lodash.clonedeep';

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
        // const startOfTheDay = moment()
        //   .utc()
        //   .local()
        //   .startOf('day');

        this.chartEvents = response.map((chartEvent) => {
          chartEvent.spent_minutes = chartEvent.end_time.diff(
            chartEvent.start_time,
            'minutes',
          );
          chartEvent.minutes_from_day_start = chartEvent.start_time.diff(
            this.startOfTheDay,
            'minutes',
          );
          chartEvent.row_number = this.rows.findIndex(
            (row) => row.value === chartEvent.type,
          );
          return chartEvent;
        });
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
////////////////
//     const min = parseInt(e.target.min);
//     const max = parseInt(e.target.max);
//
//     const value = this.Math.min(parseInt(e.target.value), parseInt(this.inputRight.nativeElement.value));
//     const percent = ((value - min) / (max - min) * 100);
//
//     this.thumbLeft = percent;
//     this.range = percent;
//
//     const difference = this.currentEvent.spent_minutes - value;
    /////////////

    if (isMax) {
      const min = parseInt(e.target.min);
      const max = parseInt(e.target.max);

      const Nvalue = this.Math.max(parseInt(e.target.value), parseInt(this.inputLeft.nativeElement.value) + 1);
      const percent = ((Nvalue - min) / (max - min)) * 100;

      this.thumbRight.nativeElement.style.right = (100 - percent) + '%';
      this.range.nativeElement.style.right = (100 - percent) + '%';

      // const difference = this.currentEvent.spent_minutes - value;




      this.currentEvent.spent_minutes = this.copiedCurrentEvent.spent_minutes;
      this.currentEvent.end_time = moment(this.copiedCurrentEvent.end_time);

      if (difference > 0) {
        this.currentEvent.end_time.subtract(difference, 'minutes');
      }

      if (
        this.currentEvent.end_time.diff(
          this.currentEvent.start_time,
          'minutes',
        ) > 0
      ) {
        this.currentEvent.spent_minutes = this.currentEvent.end_time.diff(
          this.currentEvent.start_time,
          'minutes',
        );
      } else {
        this.currentEvent.spent_minutes = 0;
      }

      this.nextEvent.start_time = moment(this.copiedNextEvent.start_time);
      if (difference > 0) {
        this.nextEvent.start_time.subtract(difference, 'minutes');
      } else {
        this.nextEvent.start_time.subtract(0, 'minutes');
      }
      this.recountTimeSpaces(this.nextEvent);
      this.recountTimeSpaces(this.previousEvent);
    } else {
      const min = parseInt(e.target.min);
      const max = parseInt(e.target.max);

      const Nvalue = this.Math.min(parseInt(e.target.value), parseInt(this.inputRight.nativeElement.value) - 1);
      const percent = ((Nvalue - min) / (max - min)) * 100;

      this.thumbLeft.nativeElement.style.left = percent + '%';
      this.range.nativeElement.style.left = percent + '%';






      this.currentEvent.end_time = moment(this.copiedCurrentEvent.end_time);
      this.currentEvent.start_time = moment(this.copiedCurrentEvent.start_time);
      this.currentEvent.start_time.add(value, 'minutes');
      this.recountTimeSpaces(this.currentEvent);

      this.previousEvent.end_time = moment(this.copiedPreviousEvent.end_time);
      this.previousEvent.end_time.add(value, 'minutes');
      this.recountTimeSpaces(this.previousEvent);

      this.nextEvent.start_time = moment(this.copiedNextEvent.start_time);

      this.nextEvent.start_time.subtract(0, 'minutes');
      this.recountTimeSpaces(this.nextEvent);
    }
  }

  public recountTimeSpaces(chartEvent: ChartEvent) {
    chartEvent.spent_minutes = chartEvent.end_time.diff(
      chartEvent.start_time,
      'minutes',
    );
    chartEvent.minutes_from_day_start = chartEvent.start_time.diff(
      this.startOfTheDay,
      'minutes',
    );
  }
}
