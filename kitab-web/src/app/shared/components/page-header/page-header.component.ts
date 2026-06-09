import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  imports: [MatIconModule],
  template: `
    <header class="page-header">
      <div>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
        @if (description()) {
          <p class="description">{{ description() }}</p>
        }
      </div>
      @if (icon()) {
        <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      }
    </header>
  `,
  styles: `
    .page-header {
      align-items: flex-start;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .page-header > div {
      flex: 1 1 auto;
      min-width: 0;
    }

    h1 {
      font-size: clamp(1.65rem, 2vw, 2.25rem);
      line-height: 1.15;
      margin: 0;
    }

    .eyebrow,
    .description {
      color: var(--kitab-muted);
      margin: 0;
    }

    .eyebrow {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    mat-icon {
      color: var(--kitab-accent);
      height: 36px;
      width: 36px;
      font-size: 36px;
      flex: 0 0 auto;
    }
  `
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly description = input('');
  readonly icon = input('');
}
