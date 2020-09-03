import { Component, Input, OnChanges } from '@angular/core';
import { ChartEvent } from '../../shared/interfaces';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  @Input() chartEvent: ChartEvent;

  constructor() {}

  ngOnChanges() {
    this.initializeMap();
  }

  public initializeMap(): void {
    const directionService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    const startLatLng = new google.maps.LatLng(
      this.chartEvent.latitude.start,
      this.chartEvent.longitude.start,
    );

    const endLatLng = new google.maps.LatLng(
      this.chartEvent.latitude.end,
      this.chartEvent.longitude.end,
    );

    const mapOptions = {
      zoom: 13,
      center: startLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);

    new google.maps.Marker({
      zoom: 15,
      position: startLatLng,
      map: map,
    });

    if (
      this.chartEvent.latitude.start === this.chartEvent.latitude.end &&
      this.chartEvent.longitude.start === this.chartEvent.longitude.end
    ) {
      return;
    }

    directionService.route(
      {
        origin: startLatLng,
        destination: endLatLng,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          console.log('Error:', status);
        }
      },
    );
  }
}
