import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
// @ts-ignore
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

export const TOKEN = 'pk.eyJ1IjoibWFyb29uZWRpb25lIiwiYSI6ImNqdmp0MzB1azBpcDAzem1naHZwMjNndGIifQ.65nvvRg9Qe\n' +
  'FUV2c6b9W4Vw';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public map!: mapboxgl.Map;
  private style = 'mapbox://styles/mapbox/streets-v11';
  private lat = 55.751244;
  private lng = 37.618423;

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken = TOKEN;

    this.map = new mapboxgl.Map({
      accessToken: TOKEN,
      container: 'map',
      style: this.style,
      zoom: 17,
      center: [this.lng, this.lat],
      pitch: 45,
      bearing: 17,
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    const draw = new MapboxDraw({
      displayControlsDefault: true,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'draw_polygon'
    });

    this.map.addControl(draw, 'top-left');

    this.map.on('draw.create', updateArea);
    this.map.on('draw.delete', updateArea);
    this.map.on('draw.update', updateArea);

    function updateArea(e: any) {
      const data = draw.getAll();
      const answer = document.getElementById('calculated-area') as HTMLElement;
      if (data.features.length > 0) {
        const area = turf.area(data);
        const rounded_area = Math.round(area * 100) / 100;
        answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
      } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete')
          alert('Click the map to draw a polygon.');
      }
    }

  }
}
