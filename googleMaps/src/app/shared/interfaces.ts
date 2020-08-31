import {Moment} from "moment";

export interface ChartEvent {
  type: string,
  latitude: string,
  longitude: string,
  start_time: Moment,
  end_time: Moment,
  spent_minutes?: number,
  minutes_from_day_start?: number,
  row_number?: number,
}
