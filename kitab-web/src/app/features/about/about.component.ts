import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatIconModule, TranslateModule, PageHeaderComponent],
  template: `
    <app-page-header
      title="About Kitab"
      description="The modern marketplace for book enthusiasts to buy, sell, and exchange books."
      icon="info"
    />

    <div class="about-content">
      <section class="about-section">
        <mat-card class="surface">
          <mat-card-content>
            <h2>Our Mission</h2>
            <p>
              Kitab is dedicated to fostering a global community of readers by making it effortless to discover, 
              exchange, and acquire books. We believe that every book deserves a second life and every reader 
              deserves access to affordable literature.
            </p>
          </mat-card-content>
        </mat-card>
      </section>

      <section class="about-section">
        <mat-card class="surface">
          <mat-card-content>
            <h2>The Problem We Solve</h2>
            <p>
              Countless amazing books sit unread on shelves while readers search for affordable copies. 
              Traditional marketplaces lack specialized tools for book exchanges. Kitab bridges this gap by 
              providing a dedicated platform designed specifically for the nuanced needs of book trading and selling.
            </p>
          </mat-card-content>
        </mat-card>
      </section>

      <section class="about-section">
        <h2>Platform Features</h2>
        <div class="features-grid">
          <mat-card class="surface feature-card">
            <mat-card-content>
              <mat-icon>swap_horiz</mat-icon>
              <h3>Direct Exchanges</h3>
              <p>Propose book-for-book trades seamlessly with our integrated offer system.</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="surface feature-card">
            <mat-card-content>
              <mat-icon>category</mat-icon>
              <h3>Smart Organization</h3>
              <p>Browse through categorized, well-structured listings with detailed condition reports.</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="surface feature-card">
            <mat-card-content>
              <mat-icon>translate</mat-icon>
              <h3>Bilingual Interface</h3>
              <p>Full support for both English and Arabic with native Right-to-Left (RTL) capabilities.</p>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <section class="about-section text-center">
        <h2>Technology Stack</h2>
        <p class="text-muted">
          Kitab is built using modern, scalable web technologies including Angular, .NET 8, Entity Framework Core, and PostgreSQL.
        </p>
      </section>
    </div>
  `,
  styles: `
    .about-content {
      display: grid;
      gap: 32px;
      margin: 0 auto;
      max-width: 1000px;
    }

    .about-section h2 {
      color: var(--kitab-accent);
      margin-bottom: 16px;
      margin-top: 0;
    }

    .about-section p {
      color: var(--kitab-text);
      font-size: 1.1rem;
      line-height: 1.7;
      margin: 0;
    }

    .features-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .feature-card {
      text-align: center;
    }

    .feature-card mat-icon {
      color: var(--kitab-accent);
      font-size: 40px;
      height: 40px;
      margin-bottom: 16px;
      width: 40px;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      margin: 0 0 8px;
    }

    .feature-card p {
      color: var(--kitab-muted);
      font-size: 1rem;
    }

    .text-center {
      text-align: center;
    }

    .text-muted {
      color: var(--kitab-muted) !important;
    }
  `
})
export class AboutComponent {}
