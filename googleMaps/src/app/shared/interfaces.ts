import {Moment} from "moment";

export interface ChartEvent {
  type: string,
  latitude: string,
  longitude: string,
  start_time: Moment,
  end_time: Moment,
  spent_minutes?: number,
  start?: number,
  row_number?: number,
  duration?: any,
  init_duration?: any
  init_start?: any
}
