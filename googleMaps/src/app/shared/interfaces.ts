import {Moment} from "moment";

export interface ChartEvent {
  type: string,
  latitude: string,
  longitude: string,
  duration: number,
  start?: number,
  init_duration?: number
  init_start?: number
  start_time?: Moment,
  end_time?: Moment,
  row_number?: number,
}

export interface Row {
  name: string,
  value: string,
  cell_reverse: boolean,
  color: string,
}
