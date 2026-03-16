import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBodyComponent, CardComponent, CardHeaderComponent } from '@coreui/angular';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { ConstructionLicense, MOCK_LICENSES } from '../../shared/models/construction-license.model';
import * as L from 'leaflet';

// Fix for Leaflet default icons
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  template: `
    <div class="map-wrapper">
      <div #mapContainer></div>
    </div>
  `,
  styles: [`
    .map-wrapper {
      height: calc(100vh - 200px);
      padding: 0 20px 20px;
      box-sizing: border-box;
      overflow: hidden;
    }

    .map-wrapper > div {
      height: 100%;
      width: 100%;
      border-radius: 4px;
      overflow: hidden;
    }
  `],
  imports: [CommonModule]
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map: L.Map | null = null;
  private readonly licenses = MOCK_LICENSES;

  // Fortaleza, Brazil coordinates
  private readonly fortalezaCenter = { lat: -3.7319, lng: -38.5267 };
  private readonly initialZoom = 13;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    if (!this.mapContainer) {
      console.warn('Map container not found');
      return;
    }

    // Initialize the map
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.fortalezaCenter.lat, this.fortalezaCenter.lng],
      this.initialZoom
    );

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add markers for each license
    this.addMarkers();
  }

  private addMarkers(): void {
    if (!this.map) return;

    this.licenses.forEach((license) => {
      const marker = L.marker([license.latitude, license.longitude], {
        icon: iconDefault
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif;">
          <strong>Process Number:</strong><br>
          ${license.processNumber}<br><br>
          <strong>Address:</strong><br>
          ${license.address}
        </div>
      `);

      marker.addTo(this.map!);
    });
  }
}
