import { Component } from '@angular/core';
import { BadgeComponent, CardBodyComponent, CardComponent, CardHeaderComponent, TableDirective } from '@coreui/angular';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { License } from '../../shared/models/license.model';

@Component({
  template: `
    <app-page-title
      title="Licenses"
      subtitle="Construction licenses prepared for list management, filters, and API-driven pagination."
    />

    <c-card>
      <c-card-header>Recent license records</c-card-header>
      <c-card-body>
        <table cTable [hover]="true" [striped]="true">
          <thead>
          <tr>
            <th scope="col">License</th>
            <th scope="col">Project</th>
            <th scope="col">District</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <tbody>
            @for (license of licenses; track license.id) {
              <tr>
                <td>{{ license.licenseNumber }}</td>
                <td>{{ license.projectName }}</td>
                <td>{{ license.district }}</td>
                <td>
                  <c-badge [color]="badgeColor(license.status)">{{ license.status }}</c-badge>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </c-card-body>
    </c-card>
  `,
  imports: [PageTitleComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, BadgeComponent]
})
export class LicensesComponent {
  readonly licenses: License[] = [
    {
      id: 1,
      licenseNumber: 'UA-2026-0014',
      projectName: 'Central Housing Block A',
      district: 'Downtown',
      status: 'approved',
      issuedAt: '2026-03-02',
      latitude: -34.6037,
      longitude: -58.3816
    },
    {
      id: 2,
      licenseNumber: 'UA-2026-0021',
      projectName: 'Riverside Logistics Warehouse',
      district: 'North Industrial',
      status: 'pending',
      issuedAt: '2026-03-10',
      latitude: -34.5928,
      longitude: -58.4271
    },
    {
      id: 3,
      licenseNumber: 'UA-2026-0033',
      projectName: 'Metro Health Clinic Expansion',
      district: 'West Borough',
      status: 'rejected',
      issuedAt: '2026-03-12',
      latitude: -34.6154,
      longitude: -58.4333
    }
  ];

  badgeColor(status: License['status']): 'success' | 'warning' | 'danger' {
    if (status === 'approved') {
      return 'success';
    }

    if (status === 'pending') {
      return 'warning';
    }

    return 'danger';
  }
}

