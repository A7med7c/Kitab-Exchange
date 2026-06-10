import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, of, take } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { Category, Listing } from '../../shared/models/api.models';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, RouterLink, TranslateModule],
  template: `
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__copy">
          <p class="eyebrow">{{ 'home.heroEyebrow' | translate }}</p>
          <h1>{{ 'home.heroTitle' | translate }}</h1>
          <p class="lead">
            {{ 'home.heroLead' | translate }}
          </p>

          <div class="hero__chips">
            @for (stat of stats; track stat.labelKey) {
              <span class="hero-chip">
                <strong>{{ stat.value }}</strong>
                {{ stat.labelKey | translate }}
              </span>
            }
          </div>

          <div class="hero__actions">
            <a mat-flat-button class="hero__cta" routerLink="/books">
              <mat-icon aria-hidden="true">search</mat-icon>
              <span>{{ 'home.exploreBooks' | translate }}</span>
            </a>
            <a mat-stroked-button class="hero__cta hero__cta--secondary" routerLink="/register">
              <mat-icon aria-hidden="true">person_add</mat-icon>
              <span>{{ 'home.joinFree' | translate }}</span>
            </a>
          </div>
        </div>

        <div class="hero__panel surface">
          <mat-icon aria-hidden="true">auto_awesome</mat-icon>
          <h2>{{ 'home.howItWorks' | translate }}</h2>
          <p>{{ 'home.howItWorksDesc' | translate }}</p>
          <ul class="steps-list">
            <li><strong>{{ 'home.step1' | translate }}</strong> {{ 'home.step1Desc' | translate }}</li>
            <li><strong>{{ 'home.step2' | translate }}</strong> {{ 'home.step2Desc' | translate }}</li>
            <li><strong>{{ 'home.step3' | translate }}</strong> {{ 'home.step3Desc' | translate }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <h2>{{ 'home.featuredCategories' | translate }}</h2>
        <a mat-button routerLink="/categories">{{ 'home.viewAll' | translate }}</a>
      </div>
      <div class="categories-grid">
        @for (category of categories; track category.id) {
          <mat-card class="category-card surface" appearance="outlined" [routerLink]="['/books']" [queryParams]="{ category: category.name }">
            <mat-card-content>
              <mat-icon aria-hidden="true">category</mat-icon>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description || ('home.exploreBooksIn' | translate) + ' ' + category.name }}</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </section>

    <section class="section">
      <div class="section__header">
        <h2>{{ 'home.latestAdditions' | translate }}</h2>
        <a mat-button routerLink="/books">{{ 'home.browseMarketplace' | translate }}</a>
      </div>
      <div class="books-grid">
        @for (book of featuredBooks; track book.id) {
          <mat-card class="book-card surface" appearance="outlined" [routerLink]="['/books', book.id]">
            <div class="book-card__image">
              @if (book.imageUrls?.length) {
                <img [src]="api.resolveAssetUrl(book.imageUrls![0])" [alt]="book.title" loading="lazy" />
              } @else {
                <div class="book-card__placeholder">
                  <mat-icon>menu_book</mat-icon>
                </div>
              }
            </div>
            <mat-card-content class="book-card__content">
              <div class="book-card__meta">
                <span class="type-badge" [class.type-sale]="book.listingType === 'ForSale'">
                  {{ book.listingType === 'ForSale' ? ('home.forSale' | translate) : ('home.forExchange' | translate) }}
                </span>
                @if (book.price) {
                  <span class="price">\${{ book.price }}</span>
                }
              </div>
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ 'home.by' | translate }} {{ book.author }}</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </section>

    <section class="section why-choose-us">
      <div class="section__header text-center">
        <h2>{{ 'home.whyChooseKitab' | translate }}</h2>
        <p class="text-muted">{{ 'home.builtForReaders' | translate }}</p>
      </div>
      <div class="features-grid">
        @for (feature of features; track feature.icon) {
          <div class="feature-item">
            <div class="feature-item__icon">
              <mat-icon aria-hidden="true">{{ feature.icon }}</mat-icon>
            </div>
            <h3>{{ feature.titleKey | translate }}</h3>
            <p>{{ feature.descriptionKey | translate }}</p>
          </div>
        }
      </div>
    </section>

    <section class="cta-section">
      <div class="cta-inner surface">
        <h2>{{ 'home.ctaTitle' | translate }}</h2>
        <p>{{ 'home.ctaDesc' | translate }}</p>
        <a mat-flat-button class="hero__cta" routerLink="/register">
          <mat-icon aria-hidden="true">rocket_launch</mat-icon>
          <span>{{ 'home.getStartedNow' | translate }}</span>
        </a>
      </div>
    </section>
  `,
  styles: `
    .hero {
      background: linear-gradient(135deg, var(--kitab-hero-start), var(--kitab-hero-end));
      border-radius: calc(var(--kitab-radius) + 4px);
      color: #fff;
      margin-bottom: 48px;
      overflow: hidden;
      padding: clamp(32px, 5vw, 64px);
    }

    .hero__inner {
      align-items: stretch;
      display: grid;
      gap: 32px;
      grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
    }

    .hero__copy {
      display: grid;
      gap: 20px;
    }

    .eyebrow {
      color: rgba(255, 255, 255, 0.82);
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin: 0;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(2.5rem, 5vw, 4rem);
      line-height: 1.1;
      margin: 0;
      max-width: 14ch;
    }

    .lead {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(1.1rem, 2vw, 1.25rem);
      line-height: 1.7;
      margin: 0;
      max-width: 52ch;
    }

    .hero__chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .hero-chip {
      align-items: center;
      backdrop-filter: blur(4px);
      background: rgba(255, 255, 255, 0.14);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 999px;
      color: #fff;
      display: inline-flex;
      font-size: 0.875rem;
      gap: 6px;
      padding: 8px 16px;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
    }

    .hero__cta {
      min-height: 52px;
      padding-inline: 24px !important;
    }

    .hero__cta--secondary {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.35);
      color: #fff;
    }

    .hero__panel {
      align-self: center;
      background: rgba(255, 255, 255, 0.98);
      border-radius: var(--kitab-radius);
      color: var(--kitab-text);
      display: grid;
      gap: 16px;
      padding: 32px;
    }

    .hero__panel mat-icon {
      color: var(--kitab-accent);
      font-size: 48px;
      height: 48px;
      width: 48px;
    }

    .hero__panel h2 {
      font-size: 1.5rem;
      margin: 0;
    }

    .hero__panel p {
      color: var(--kitab-muted);
      margin: 0;
    }

    .steps-list {
      display: grid;
      gap: 16px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .steps-list li {
      background: var(--kitab-background);
      border-radius: var(--kitab-radius);
      padding: 12px 16px;
    }

    .section {
      margin-bottom: 64px;
    }

    .section__header {
      align-items: flex-end;
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .section__header h2 {
      font-size: 2rem;
      margin: 0;
    }

    .categories-grid {
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    }

    .category-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .category-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-4px);
    }

    .category-card mat-icon {
      color: var(--kitab-accent);
      margin-bottom: 12px;
    }

    .category-card h3 {
      font-size: 1.2rem;
      margin: 0 0 8px;
    }

    .category-card p {
      color: var(--kitab-muted);
      margin: 0;
    }

    .books-grid {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .book-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .book-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      transform: translateY(-4px);
    }

    .book-card__image {
      aspect-ratio: 3/4;
      background: var(--kitab-background);
      border-bottom: 1px solid var(--kitab-border);
      position: relative;
    }

    .book-card__image img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }

    .book-card__placeholder {
      align-items: center;
      color: var(--kitab-border);
      display: flex;
      height: 100%;
      justify-content: center;
      width: 100%;
    }

    .book-card__placeholder mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
    }

    .book-card__content {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 16px;
    }

    .book-card__meta {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .type-badge {
      background: var(--kitab-accent-soft);
      border-radius: 4px;
      color: var(--kitab-accent);
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 8px;
    }

    .type-sale {
      background: rgba(16, 185, 129, 0.1);
      color: rgb(16, 185, 129);
    }

    .price {
      font-weight: 700;
    }

    .book-title {
      font-size: 1.1rem;
      margin: 0 0 4px;
    }

    .book-author {
      color: var(--kitab-muted);
      font-size: 0.9rem;
      margin: 0;
    }

    .why-choose-us {
      margin-top: 80px;
    }

    .text-center {
      align-items: center;
      flex-direction: column;
      text-align: center;
    }

    .text-muted {
      color: var(--kitab-muted);
      font-size: 1.1rem;
      margin-top: 8px;
    }

    .features-grid {
      display: grid;
      gap: 32px;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      margin-top: 40px;
    }

    .feature-item {
      text-align: center;
    }

    .feature-item__icon {
      align-items: center;
      background: var(--kitab-accent-soft);
      border-radius: 999px;
      display: inline-flex;
      height: 64px;
      justify-content: center;
      margin-bottom: 16px;
      width: 64px;
    }

    .feature-item__icon mat-icon {
      color: var(--kitab-accent);
      font-size: 32px;
      height: 32px;
      width: 32px;
    }

    .feature-item h3 {
      font-size: 1.25rem;
      margin: 0 0 8px;
    }

    .feature-item p {
      color: var(--kitab-muted);
      line-height: 1.6;
      margin: 0;
    }

    .cta-section {
      margin-bottom: 64px;
      margin-top: 80px;
    }

    .cta-inner {
      align-items: center;
      border: 2px dashed var(--kitab-border);
      border-radius: calc(var(--kitab-radius) + 8px);
      display: flex;
      flex-direction: column;
      padding: 64px 24px;
      text-align: center;
    }

    .cta-inner h2 {
      font-size: 2.5rem;
      margin: 0 0 16px;
    }

    .cta-inner p {
      color: var(--kitab-muted);
      font-size: 1.2rem;
      margin: 0 0 32px;
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

      .section__header {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
      }
    }
  `
})
export class HomeComponent implements OnInit {
  protected readonly api = inject(ApiService);

  featuredBooks: Listing[] = [];
  categories: Category[] = [];

  protected readonly stats = [
    { value: '10K+', labelKey: 'home.statsActiveReaders' },
    { value: '50K+', labelKey: 'home.statsBooksExchanged' },
    { value: '100%', labelKey: 'home.statsCommunityTrust' }
  ];

  protected readonly features = [
    { 
      icon: 'savings', 
      titleKey: 'home.featureSaveMoney', 
      descriptionKey: 'home.featureSaveMoneyDesc' 
    },
    { 
      icon: 'public', 
      titleKey: 'home.featureEcoFriendly', 
      descriptionKey: 'home.featureEcoFriendlyDesc' 
    },
    { 
      icon: 'local_library', 
      titleKey: 'home.featureDiscover', 
      descriptionKey: 'home.featureDiscoverDesc' 
    }
  ];

  ngOnInit(): void {
    this.api.getCategories().pipe(
      take(1),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    ).subscribe(data => {
      console.log('Categories:', data);
      this.categories = data ? data.slice(0, 4) : [];
    });

    this.api.getListings().pipe(
      take(1),
      catchError((error) => {
        console.error('Error fetching listings:', error);
        return of([]);
      })
    ).subscribe(data => {
      console.log('Listings:', data);
      this.featuredBooks = data ? data.slice(0, 8) : [];
    });
  }
}
