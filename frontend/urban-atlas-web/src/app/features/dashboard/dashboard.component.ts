import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

@Component({
  template: `
    <app-page-title
      title="UrbanAtlas Dashboard"
      subtitle="Track construction licensing activity and quickly jump to the map and license registry."
    />

    <c-row class="g-4">
      <c-col md="4">
        <c-card>
          <c-card-header>Active licenses</c-card-header>
          <c-card-body>
            <p class="display-6 mb-2">128</p>
            <a [routerLink]="['/licenses']">View license list</a>
          </c-card-body>
        </c-card>
      </c-col>
      <c-col md="4">
        <c-card>
          <c-card-header>Map markers</c-card-header>
          <c-card-body>
            <p class="display-6 mb-2">74</p>
            <a [routerLink]="['/map']">Open map view</a>
          </c-card-body>
        </c-card>
      </c-col>
      <c-col md="4">
        <c-card>
          <c-card-header>Pending reviews</c-card-header>
          <c-card-body>
            <p class="display-6 mb-2">19</p>
            <a [routerLink]="['/licenses']">Review pending records</a>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  `,
  imports: [PageTitleComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, RouterLink]
})
export class DashboardComponent {}


