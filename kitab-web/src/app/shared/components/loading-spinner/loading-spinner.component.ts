import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading" role="status" [attr.aria-label]="label()">
      <mat-spinner [diameter]="diameter()" />
      @if (label()) {
        <p>{{ label() }}</p>
      }
    </div>
  `,
  styles: `
    .loading {
      align-items: center;
      display: grid;
      gap: 12px;
      justify-items: center;
      padding: 32px;
    }

    p {
      color: var(--kitab-muted);
      margin: 0;
    }
  `
})
export class LoadingSpinnerComponent {
  readonly diameter = input(40);
  readonly label = input('');
}
