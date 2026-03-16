import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  template: `
    <div class="mb-4">
      <h1 class="h3 mb-1">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="text-body-secondary mb-0">{{ subtitle() }}</p>
      }
    </div>
  `
})
export class PageTitleComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}

