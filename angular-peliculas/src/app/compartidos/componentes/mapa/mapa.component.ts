import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { icon, latLng, LeafletMouseEvent, marker, MarkerOptions, tileLayer, Marker } from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Coordenada } from './coordenada';

@Component({
  selector: 'app-mapa',
  imports: [LeafletModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  // ngOnInit(): void {
  //   this.capas = this.coordenadasIniciales.map(valor => {
  //     const marcador = marker([valor.latitud, valor.longitud], this.markerOptions);

  //     return marcador;
  //   })
  // }
  ngOnInit(): void {
    console.log('🗺️ MapaComponent - ngOnInit');
    console.log('📍 Coordenadas iniciales recibidas:', this.coordenadasIniciales);

    this.capas = this.coordenadasIniciales.map(valor => {
      console.log('📌 Creando marcador para:', valor);
      return marker([valor.latitud, valor.longitud], this.markerOptions);
    });

    console.log('🎯 Capas creadas:', this.capas);
  }

  @Input()
  coordenadasIniciales: Coordenada[] = [];

  @Output()
  coordenadaSeleccionada = new EventEmitter<Coordenada>();

  markerOptions: MarkerOptions = {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
    })
  };

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    ],
    zoom: 14,
    center: latLng(40.41, -3.70)
  };

  capas: Marker<any>[] = [];

  manejarClick(event: LeafletMouseEvent) {
    const latitud = event.latlng.lat;
    const longitud = event.latlng.lng;

    this.capas = []; //Reset
    this.capas.push(marker([latitud, longitud], this.markerOptions)); //para colocar en el mapa
    this.coordenadaSeleccionada.emit({ latitud, longitud });
  }






}
