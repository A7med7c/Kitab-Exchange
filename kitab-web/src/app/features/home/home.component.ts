import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslateModule],
  template: `
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__copy">
          <p class="eyebrow">{{ 'home.eyebrow' | translate }}</p>
          <h1>{{ 'home.title' | translate }}</h1>
          <p class="lead">{{ 'home.description' | translate }}</p>

          <div class="hero__chips">
            @for (stat of stats; track stat.labelKey) {
              <span class="hero-chip">{{ stat.labelKey | translate }}</span>
            }
          </div>

          <div class="hero__actions">
            <a mat-flat-button class="hero__cta" routerLink="/books">
              <mat-icon aria-hidden="true">menu_book</mat-icon>
              <span>{{ 'home.browse' | translate }}</span>
            </a>
            <a mat-stroked-button class="hero__cta hero__cta--secondary" routerLink="/register">
              <mat-icon aria-hidden="true">person_add</mat-icon>
              <span>{{ 'home.join' | translate }}</span>
            </a>
          </div>
        </div>

        <div class="hero__panel surface">
          <mat-icon aria-hidden="true">auto_stories</mat-icon>
          <h2>{{ 'home.panelTitle' | translate }}</h2>
          <p>{{ 'home.panelDescription' | translate }}</p>
          <ul>
            @for (point of panelPoints; track point) {
              <li>{{ point | translate }}</li>
            }
          </ul>
        </div>
      </div>
    </section>

    <section class="features">
      @for (feature of features; track feature.icon) {
        <mat-card appearance="outlined" class="feature-card">
          <mat-card-content>
            <div class="feature-card__icon">
              <mat-icon aria-hidden="true">{{ feature.icon }}</mat-icon>
            </div>
            <h2>{{ feature.titleKey | translate }}</h2>
            <p>{{ feature.descriptionKey | translate }}</p>
          </mat-card-content>
        </mat-card>
      }
    </section>
  `,
  styles: `
    .hero {
      background: linear-gradient(135deg, var(--kitab-hero-start), var(--kitab-hero-end));
      border-radius: calc(var(--kitab-radius) + 4px);
      color: #fff;
      margin-bottom: 28px;
      overflow: hidden;
      padding: clamp(24px, 5vw, 48px);
    }

    .hero__inner {
      align-items: stretch;
      display: grid;
      gap: 24px;
      grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.9fr);
    }

    .hero__copy {
      display: grid;
      gap: 16px;
    }

    .eyebrow {
      color: rgba(255, 255, 255, 0.82);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      margin: 0;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(2rem, 4.8vw, 3.2rem);
      line-height: 1.1;
      margin: 0;
      max-width: 14ch;
    }

    .lead {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1rem, 2vw, 1.15rem);
      line-height: 1.7;
      margin: 0;
      max-width: 52ch;
    }

    .hero__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hero-chip {
      backdrop-filter: blur(4px);
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 999px;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 8px 14px;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 4px;
    }

    .hero__cta {
      min-height: 48px;
    }

    .hero__cta--secondary {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.35);
      color: #fff;
    }

    .hero__panel {
      align-self: center;
      background: rgba(255, 255, 255, 0.96);
      color: var(--kitab-text);
      display: grid;
      gap: 12px;
      padding: 24px;
    }

    .hero__panel mat-icon {
      color: var(--kitab-accent);
      font-size: 40px;
      height: 40px;
      width: 40px;
    }

    .hero__panel h2,
    .hero__panel p,
    .hero__panel ul {
      margin: 0;
    }

    .hero__panel p,
    .hero__panel li {
      color: var(--kitab-muted);
      line-height: 1.6;
    }

    .hero__panel ul {
      display: grid;
      gap: 8px;
      padding-inline-start: 18px;
    }

    .features {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .feature-card mat-card-content {
      display: grid;
      gap: 12px;
    }

    .feature-card__icon {
      align-items: center;
      background: var(--kitab-accent-soft);
      border-radius: 999px;
      display: inline-flex;
      height: 48px;
      justify-content: center;
      width: 48px;
    }

    .feature-card__icon mat-icon {
      color: var(--kitab-accent);
    }

    .feature-card h2,
    .feature-card p {
      margin: 0;
    }

    .feature-card p {
      color: var(--kitab-muted);
      line-height: 1.6;
    }

    @media (max-width: 899.98px) {
      .hero__inner {
        grid-template-columns: 1fr;
      }

      h1 {
        max-width: none;
      }
    }

    @media (max-width: 599.98px) {
      .hero__actions {
        flex-direction: column;
      }

      .hero__cta {
        justify-content: center;
        width: 100%;
      }
    }
  `
})
export class HomeComponent {
  protected readonly stats = [
    { labelKey: 'home.stats.exchange' },
    { labelKey: 'home.stats.sale' },
    { labelKey: 'home.stats.trust' }
  ];

  protected readonly panelPoints = ['home.panel.point1', 'home.panel.point2', 'home.panel.point3'];

  protected readonly features = [
    { icon: 'menu_book', titleKey: 'home.features.browse', descriptionKey: 'home.features.browseDesc' },
    { icon: 'library_add', titleKey: 'home.features.list', descriptionKey: 'home.features.listDesc' },
    { icon: 'forum', titleKey: 'home.features.connect', descriptionKey: 'home.features.connectDesc' }
  ];
}
