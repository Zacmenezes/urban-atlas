import { Component, AfterViewInit, ViewChild, ElementRef, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, distinctUntilChanged, map, of, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LicensesApiService } from '../../core/services/licenses-api.service';
import { ConstructionLicense } from '../../shared/models/construction-license.model';
import * as L from 'leaflet';
import 'leaflet.markercluster';

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
  private readonly licensesApiService = inject(LicensesApiService);
  private readonly destroyRef = inject(DestroyRef);
  private map: L.Map | null = null;
  private licenses: ConstructionLicense[] = [];
  private boundaryLayer: L.GeoJSON | null = null;
  private outsideMaskLayer: L.Polygon | null = null;
  private markerClusterGroup: L.MarkerClusterGroup | null = null;
  private readonly viewportChanges = new Subject<{ bbox: string; zoom: number }>();

  // Fortaleza, Brazil coordinates
  private readonly fortalezaCenter = { lat: -3.7319, lng: -38.5267 };
  private readonly initialZoom = 12;
  private readonly fortalezaGeoJsonUrl = 'assets/geo/fortaleza.geojson';

  ngAfterViewInit(): void {
    void this.initializeMap();
  }

  private async initializeMap(): Promise<void> {
    if (!this.mapContainer) {
      console.warn('Map container not found');
      return;
    }

    // Initialize map centered in Fortaleza.
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: true
    }).setView(
      [this.fortalezaCenter.lat, this.fortalezaCenter.lng],
      this.initialZoom
    );

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.initializeMarkerClusters();
    this.initializeViewportLoading();
    await this.loadFortalezaBoundary();
    this.registerMapEvents();
    this.queueViewportLoad();
  }

  private initializeMarkerClusters(): void {
    if (!this.map) {
      return;
    }

    this.markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false
    });
    this.markerClusterGroup.addTo(this.map);
  }

  private initializeViewportLoading(): void {
    this.viewportChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((previous, current) => previous.bbox === current.bbox && previous.zoom === current.zoom),
        switchMap(({ bbox, zoom }) =>
          this.licensesApiService.list({ bbox, zoom }).pipe(
            map((licenses) => ({ licenses, zoom })),
            catchError((error) => {
              console.error('Failed to load licenses from API:', error);
              return of({ licenses: [] as ConstructionLicense[], zoom });
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ licenses, zoom }) => {
          this.licenses = licenses;
          this.renderMarkers(zoom);
        }
      });
  }

  private registerMapEvents(): void {
    if (!this.map) {
      return;
    }

    this.map.on('moveend', () => this.queueViewportLoad());
    this.map.on('zoomend', () => this.queueViewportLoad());
  }

  private queueViewportLoad(): void {
    if (!this.map) {
      return;
    }

    const bounds = this.map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ].join(',');

    this.viewportChanges.next({
      bbox,
      zoom: this.map.getZoom()
    });
  }

  private async loadFortalezaBoundary(): Promise<void> {
    if (!this.map) {
      return;
    }

    try {
      const response = await fetch(this.fortalezaGeoJsonUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const geoJson = (await response.json()) as GeoJSON.GeoJsonObject;
      this.outsideMaskLayer?.remove();
      this.boundaryLayer?.remove();

      const innerRing = this.extractMainRing(geoJson);
      if (innerRing.length > 0) {
        const worldRing: L.LatLngExpression[] = [
          [90, -180],
          [90, 180],
          [-90, 180],
          [-90, -180]
        ];

        this.outsideMaskLayer = L.polygon([worldRing, innerRing], {
          stroke: false,
          fillColor: '#6B7280',
          fillOpacity: 0.35,
          fillRule: 'evenodd',
          interactive: false
        }).addTo(this.map);
      }

      this.boundaryLayer = L.geoJSON(geoJson, {
        style: {
          color: '#2A7FFF',
          weight: 3,
          fillOpacity: 0,
          fillColor: '#2A7FFF'
        }
      }).addTo(this.map);

      const bounds = this.boundaryLayer.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Failed to load Fortaleza GeoJSON boundary:', error);
    }
  }

  private extractMainRing(geoJson: GeoJSON.GeoJsonObject): L.LatLngExpression[] {
    let feature: GeoJSON.Feature | null = null;

    if (geoJson.type === 'FeatureCollection') {
      const collection = geoJson as GeoJSON.FeatureCollection;
      feature = (collection.features[0] as GeoJSON.Feature) ?? null;
    } else if (geoJson.type === 'Feature') {
      feature = geoJson as GeoJSON.Feature;
    }

    if (!feature || !feature.geometry) {
      return [];
    }

    const geometry = feature.geometry;
    let ring: number[][] = [];

    if (geometry.type === 'Polygon') {
      ring = geometry.coordinates[0] as number[][];
    } else if (geometry.type === 'MultiPolygon') {
      ring = geometry.coordinates[0][0] as number[][];
    }

    return ring.map(([lng, lat]) => [lat, lng] as L.LatLngExpression);
  }

  private renderMarkers(zoom: number): void {
    if (!this.markerClusterGroup) {
      return;
    }

    this.markerClusterGroup.clearLayers();

    if (zoom < 12) {
      return;
    }

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

      this.markerClusterGroup?.addLayer(marker);
    });
  }
}
