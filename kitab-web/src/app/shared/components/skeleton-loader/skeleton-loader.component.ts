import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  template: `
    <div class="skeleton-grid" [style.--columns]="columns()">
      @for (item of placeholders(); track item) {
        <div class="skeleton-card surface" aria-hidden="true">
          <div class="skeleton-line skeleton-line--title"></div>
          <div class="skeleton-line skeleton-line--subtitle"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line skeleton-line--short"></div>
        </div>
      }
    </div>
  `,
  styles: `
    .skeleton-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }

    .skeleton-card {
      display: grid;
      gap: 12px;
      padding: 20px;
    }

    .skeleton-line {
      animation: pulse 1.4s ease-in-out infinite;
      background: linear-gradient(90deg, #eef4ef 25%, #f8faf8 50%, #eef4ef 75%);
      background-size: 200% 100%;
      border-radius: 4px;
      height: 14px;
    }

    .skeleton-line--title {
      height: 20px;
      width: 70%;
    }

    .skeleton-line--subtitle {
      width: 45%;
    }

    .skeleton-line--short {
      width: 35%;
    }

    @keyframes pulse {
      0% {
        background-position: 200% 0;
      }

      100% {
        background-position: -200% 0;
      }
    }
  `
})
export class SkeletonLoaderComponent {
  readonly count = input(6);
  readonly columns = input('repeat(auto-fit, minmax(260px, 1fr))');

  protected placeholders(): number[] {
    return Array.from({ length: this.count() }, (_, index) => index);
  }
}
