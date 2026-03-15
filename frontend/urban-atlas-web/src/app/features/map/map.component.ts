import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent } from '@coreui/angular';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

@Component({
  template: `
    <app-page-title
      title="Construction License Map"
      subtitle="This area is reserved for the geospatial visualization layer and map controls."
    />

    <c-card>
      <c-card-header>Map canvas</c-card-header>
      <c-card-body>
        <div class="border rounded d-flex align-items-center justify-content-center text-body-secondary"
             style="height: 520px; background: var(--cui-tertiary-bg);">
          Map integration placeholder (Leaflet/Mapbox/ArcGIS)
        </div>
      </c-card-body>
    </c-card>
  `,
  imports: [PageTitleComponent, CardComponent, CardHeaderComponent, CardBodyComponent]
})
export class MapComponent {}

