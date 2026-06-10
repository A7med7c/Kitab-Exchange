import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslateModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <div class="brand">
            <mat-icon aria-hidden="true" class="brand__icon">auto_stories</mat-icon>
            <span class="brand__text">{{ 'footer.brandName' | translate }}</span>
          </div>
          <p class="footer__desc">{{ 'footer.description' | translate }}</p>
        </div>
        
        <div class="footer__links">
          <div class="footer__column">
            <h3>{{ 'footer.brandName' | translate }}</h3>
            <a routerLink="/about">{{ 'footer.about' | translate }}</a>
            <a routerLink="/contact">{{ 'footer.contact' | translate }}</a>
            <a routerLink="/faq">{{ 'footer.faq' | translate }}</a>
          </div>
          <div class="footer__column">
            <h3>{{ 'footer.legal' | translate }}</h3>
            <a routerLink="/">{{ 'footer.terms' | translate }}</a>
            <a routerLink="/">{{ 'footer.privacy' | translate }}</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <p>{{ 'footer.copyright' | translate }}</p>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--kitab-surface);
      border-top: 1px solid var(--kitab-border);
      color: var(--kitab-text);
      margin-top: auto;
      padding: 48px 20px 24px;
    }

    .footer__inner {
      display: grid;
      gap: 32px;
      grid-template-columns: 1fr;
      margin: 0 auto;
      max-width: 1200px;
    }

    .brand {
      align-items: center;
      display: inline-flex;
      gap: 10px;
    }

    .brand__icon {
      color: var(--kitab-accent);
    }

    .brand__text {
      font-size: 1.25rem;
      font-weight: 800;
    }

    .footer__desc {
      color: var(--kitab-muted);
      margin-top: 12px;
    }

    .footer__links {
      display: grid;
      gap: 32px;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }

    .footer__column {
      display: grid;
      gap: 12px;
    }

    .footer__column h3 {
      font-size: 1rem;
      margin: 0 0 8px;
    }

    .footer__column a {
      color: var(--kitab-muted);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer__column a:hover {
      color: var(--kitab-accent);
    }

    .footer__bottom {
      border-top: 1px solid var(--kitab-border);
      color: var(--kitab-muted);
      font-size: 0.875rem;
      margin: 48px auto 0;
      max-width: 1200px;
      padding-top: 24px;
      text-align: center;
    }

    @media (min-width: 768px) {
      .footer__inner {
        grid-template-columns: 1.5fr 2fr;
      }
    }
  `
})
export class FooterComponent {
}
