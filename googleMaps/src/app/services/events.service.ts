import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChartEvent } from '../shared/interfaces';

@Injectable()
export class EventsService {

  public events: ChartEvent[] = [
    {
      type: 'ON',
      latitude: {
        start: 51.678418,
        end: 51.678418
      },
      longitude: {
        start: 7.809007,
        end: 7.809007
      },
      duration: 100
    },
    {
      type: 'OFF',
      latitude: {
        start: 51.678418,
        end: 51.678418
      },
      longitude: {
        start: 7.809007,
        end: 7.809007
      },
      duration: 80
    },
    {
      type: 'D',
      latitude: {
        start: 51.678418,
        end: 52.018418
      },
      longitude: {
        start: 7.909007,
        end: 8.100007
      },
      duration: 120
    },
    {
      type: 'SB',
      latitude: {
        start: 52.018418,
        end: 52.018418
      },
      longitude: {
        start: 8.100007,
        end: 8.100007
      },
      duration: 200
    },
    {
      type: 'D',
      latitude: {
        start: 52.018418,
        end: 52.218418
      },
      longitude: {
        start: 8.100007,
        end: 8.236007
      },
      duration: 250
    },
    {
      type: 'ON',
      latitude: {
        start: 52.218418,
        end: 52.218418
      },
      longitude: {
        start: 8.236007,
        end: 8.236007
      },
      duration: 100
    },
    {
      type: 'OFF',
      latitude: {
        start: 52.218418,
        end: 52.218418
      },
      longitude: {
        start: 8.236007,
        end: 8.236007
      },
      duration: 80
    },
    {
      type: 'D',
      latitude: {
        start: 52.218418,
        end: 52.433418
      },
      longitude: {
        start: 8.236007,
        end: 8.346002
      },
      duration: 250
    },
    {
      type: 'SB',
      latitude: {
        start: 52.433418,
        end: 52.433418
      },
      longitude: {
        start: 8.346002,
        end: 8.346002
      },
      duration: 120
    },
  ];
  constructor() {}

  public getEvents(): Observable<ChartEvent[]> {
    return of(this.events);
  }
}
