import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Listing } from '../../../shared/models/api.models';

@Component({
  selector: 'app-contact-dialog',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'requests.send' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ data.listingTitle }}</p>
      <mat-form-field class="full-width">
        <mat-label>{{ 'requests.message' | translate }}</mat-label>
        <textarea matInput rows="4" [formControl]="data.messageControl"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>{{ 'common.close' | translate }}</button>
      <button mat-flat-button type="button" [mat-dialog-close]="true">{{ 'requests.send' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
    }
  `
})
export class ContactDialogComponent {
  readonly data = inject<{ listingTitle: string; messageControl: FormControl<string> }>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'app-detail',
  imports: [
    CurrencyPipe,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule
  ],
  template: `
    @if (loading()) {
      <app-loading-spinner [label]="'common.loading' | translate" />
    } @else if (listing(); as item) {
      <app-page-header [title]="item.title" [description]="item.author" icon="menu_book" />
      @if (item.imageUrls?.length) {
        <div class="image-gallery">
          @for (imageUrl of item.imageUrls; track imageUrl) {
            <img [src]="resolveImageUrl(imageUrl)" [alt]="item.title" />
          }
        </div>
      }
      <mat-card class="surface detail-card" appearance="outlined">
        <mat-card-content>
          <p>{{ item.description }}</p>
          <mat-chip-set aria-label="Listing facts">
            <mat-chip>{{ item.category }}</mat-chip>
            <mat-chip>{{ item.condition }}</mat-chip>
            <mat-chip>{{ item.listingType }}</mat-chip>
            <mat-chip>{{ item.status }}</mat-chip>
          </mat-chip-set>
          @if (item.price) {
            <p class="price">{{ item.price | currency }}</p>
          }
        </mat-card-content>
        <mat-card-actions align="end">
          <a mat-button routerLink="/books">
            <mat-icon aria-hidden="true">arrow_back</mat-icon>
            <span>{{ 'common.back' | translate }}</span>
          </a>
          @if (isOwner()) {
            <a mat-stroked-button [routerLink]="['/books', item.id, 'edit']">
              <mat-icon aria-hidden="true">edit</mat-icon>
              <span>{{ 'common.edit' | translate }}</span>
            </a>
            <button mat-stroked-button type="button" (click)="deleteListing()">
              <mat-icon aria-hidden="true">delete</mat-icon>
              <span>{{ 'common.delete' | translate }}</span>
            </button>
          } @else if (authService.isAuthenticated()) {
            <button mat-flat-button type="button" (click)="openContactDialog()">
              <mat-icon aria-hidden="true">forum</mat-icon>
              <span>{{ 'requests.send' | translate }}</span>
            </button>
          } @else {
            <a mat-flat-button routerLink="/login" [queryParams]="{ returnUrl: currentUrl }">
              <mat-icon aria-hidden="true">login</mat-icon>
              <span>{{ 'requests.loginToContact' | translate }}</span>
            </a>
          }
        </mat-card-actions>
      </mat-card>
    } @else {
      <app-empty-state
        [title]="'books.notFoundTitle' | translate"
        [message]="'books.notFoundMessage' | translate"
        icon="search_off"
      />
    }
  `,
  styles: `
    .detail-card {
      max-width: 840px;
    }

    .image-gallery {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      margin-bottom: 16px;
      max-width: 840px;
    }

    .image-gallery img {
      border-radius: 12px;
      height: 180px;
      object-fit: cover;
      width: 100%;
    }

    mat-card-content {
      display: grid;
      gap: 16px;
    }

    .price {
      color: var(--kitab-accent);
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
    }
  `
})
export class DetailComponent {
  private readonly api = inject(ApiService);
  protected readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(true);
  protected readonly listing = signal<Listing | null>(null);
  protected readonly isOwner = signal(false);
  protected readonly currentUrl = this.router.url;

  protected resolveImageUrl(url: string): string {
    return this.api.resolveAssetUrl(url);
  }

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        switchMap((id) => {
          if (!id) {
            return of({ listing: null as Listing | null, isOwner: false });
          }

          const listing$ = this.api.getListing(id).pipe(catchError(() => of(null)));
          const mine$ = this.authService.isAuthenticated()
            ? this.api.getMyListings().pipe(catchError(() => of([])))
            : of([]);

          return combineLatest([listing$, mine$]).pipe(
            map(([listing, mine]) => ({
              listing,
              isOwner: !!listing && mine.some((entry) => entry.id === listing.id)
            }))
          );
        }),
        tap(() => this.loading.set(false))
      )
      .subscribe(({ listing, isOwner }) => {
        this.listing.set(listing);
        this.isOwner.set(isOwner);
      });
  }

  protected deleteListing(): void {
    const listing = this.listing();
    if (!listing) {
      return;
    }

    this.api.deleteListing(listing.id).subscribe({
      next: () => {
        this.notifications.success('myListings.deleted');
        void this.router.navigate(['/my-listings']);
      }
    });
  }

  protected openContactDialog(): void {
    const listing = this.listing();
    if (!listing) {
      return;
    }

    const messageControl = this.fb.nonNullable.control('', [Validators.maxLength(1000)]);
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '480px',
      data: { listingTitle: listing.title, messageControl }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.api.sendContactRequest({ listingId: listing.id, message: messageControl.value || null }).subscribe({
        next: () => {
          this.notifications.success('requests.sent');
          void this.router.navigate(['/requests']);
        }
      });
    });
  }
}
