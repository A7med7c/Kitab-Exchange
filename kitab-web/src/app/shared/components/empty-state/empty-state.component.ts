import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <section class="empty-state surface">
      <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      <h2>{{ title() }}</h2>
      <p>{{ message() }}</p>
    </section>
  `,
  styles: `
    .empty-state {
      align-items: center;
      display: grid;
      justify-items: center;
      padding: 40px 24px;
      text-align: center;
    }

    mat-icon {
      color: var(--kitab-accent);
      font-size: 40px;
      height: 40px;
      width: 40px;
    }

    h2 {
      font-size: 1.2rem;
      margin: 12px 0 4px;
    }

    p {
      color: var(--kitab-muted);
      margin: 0;
      max-width: 46ch;
    }
  `
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly icon = input('menu_book');
}
