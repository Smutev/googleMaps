import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChartEvent } from '../shared/interfaces';
import * as moment from 'moment';

@Injectable()
export class EventsService {
  public startOfTheDay = moment()
    .utc()
    .local()
    .startOf('day');


  public events: ChartEvent[] = [
    {
      type: 'ON',
      latitude: '',
      longitude: '',
      start_time: moment(this.startOfTheDay),
      end_time: moment(this.startOfTheDay.add(130, 'minutes')),
    },
    {
      type: 'OFF',
      latitude: '',
      longitude: '',
      start_time: moment(this.startOfTheDay),
      end_time: moment(this.startOfTheDay.add(480, 'minutes')),
    },
    {
      type: 'D',
      latitude: '',
      longitude: '',
      start_time: moment(this.startOfTheDay),
      end_time: moment(this.startOfTheDay.add(154, 'minutes')),
    },
    {
      type: 'SB',
      latitude: '',
      longitude: '',
      start_time: moment(this.startOfTheDay),
      end_time: moment(this.startOfTheDay.add(160, 'minutes')),
    },
  ];
  constructor() {
    // console.log(this.events)
  }

  public getEvents(): Observable<ChartEvent[]> {
    return of(this.events);
  }
}
