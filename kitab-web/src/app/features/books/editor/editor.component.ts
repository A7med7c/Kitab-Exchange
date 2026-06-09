import { Component, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategorySelectComponent } from '../../../shared/components/category-select/category-select.component';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  LISTING_CONDITIONS,
  LISTING_STATUSES,
  LISTING_TYPES,
  ListingFormRequest,
  ListingType
} from '../../../shared/models/api.models';

@Component({
  selector: 'app-editor',
  imports: [
    CategorySelectComponent,
    ImageUploadComponent,
    LoadingSpinnerComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    TranslateModule
  ],
  template: `
    @if (loading()) {
      <app-loading-spinner [label]="'common.loading' | translate" />
    } @else {
      <app-page-header
        [title]="(isEdit() ? 'books.editTitle' : 'books.newTitle') | translate"
        [description]="(isEdit() ? 'books.editDescription' : 'books.newDescription') | translate"
        icon="add_circle"
      />
      <form class="editor-form surface" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field>
          <mat-label>{{ 'books.form.title' | translate }}</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'books.form.author' | translate }}</mat-label>
          <input matInput formControlName="author" />
        </mat-form-field>
        <app-category-select [control]="form.controls.category" />
        <app-image-upload #imageUpload [initialUrls]="existingImageUrls()" />
        <mat-form-field>
          <mat-label>{{ 'books.form.condition' | translate }}</mat-label>
          <mat-select formControlName="condition">
            @for (condition of conditions; track condition) {
              <mat-option [value]="condition">{{ condition }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'books.form.type' | translate }}</mat-label>
          <mat-select formControlName="listingType">
            @for (type of listingTypes; track type) {
              <mat-option [value]="type">{{ type }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        @if (isForSale()) {
          <mat-form-field>
            <mat-label>{{ 'books.form.price' | translate }}</mat-label>
            <input matInput type="number" formControlName="price" />
          </mat-form-field>
        }
        <mat-form-field>
          <mat-label>{{ 'books.form.status' | translate }}</mat-label>
          <mat-select formControlName="status">
            @for (status of statuses; track status) {
              <mat-option [value]="status">{{ status }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>{{ 'books.form.description' | translate }}</mat-label>
          <textarea matInput rows="5" formControlName="description"></textarea>
        </mat-form-field>
        <button mat-flat-button type="submit" [disabled]="form.invalid || saving()">
          <mat-icon aria-hidden="true">save</mat-icon>
          <span>{{ 'common.save' | translate }}</span>
        </button>
      </form>
    }
  `,
  styles: `
    .editor-form {
      display: grid;
      gap: 16px;
      max-width: 720px;
      padding: 20px;
    }

    button {
      justify-self: start;
    }
  `
})
export class EditorComponent {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  private readonly imageUpload = viewChild.required<ImageUploadComponent>('imageUpload');

  protected readonly conditions = LISTING_CONDITIONS;
  protected readonly listingTypes = LISTING_TYPES;
  protected readonly statuses = LISTING_STATUSES;
  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly isEdit = signal(false);
  protected readonly existingImageUrls = signal<string[]>([]);
  private listingId: string | null = null;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    condition: ['Good' as const, Validators.required],
    listingType: ['ForExchange' as ListingType, Validators.required],
    status: ['Available' as const, Validators.required],
    price: [''],
    description: ['', Validators.required]
  });

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        tap((id) => {
          this.isEdit.set(!!id);
          this.listingId = id;
          if (id) {
            this.loading.set(true);
          }
        }),
        switchMap((id) => (id ? this.api.getListing(id).pipe(catchError(() => {
          void this.router.navigate(['/404']);
          return of(null);
        })) : of(null)))
      )
      .subscribe((listing) => {
        this.loading.set(false);
        if (listing) {
          this.existingImageUrls.set(listing.imageUrls ?? []);
          this.form.patchValue({
            title: listing.title,
            author: listing.author,
            category: listing.category,
            condition: listing.condition as typeof this.form.controls.condition.value,
            listingType: listing.listingType as typeof this.form.controls.listingType.value,
            status: listing.status as typeof this.form.controls.status.value,
            price: listing.price?.toString() ?? '',
            description: listing.description
          });
        }
      });
  }

  protected isForSale(): boolean {
    return this.form.controls.listingType.value === 'ForSale';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.toPayload();
    this.saving.set(true);

    const request$ = this.isEdit() && this.listingId
      ? this.api.updateListing(this.listingId, payload)
      : this.api.createListing(payload);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (listing) => {
        this.notifications.success(this.isEdit() ? 'books.updated' : 'books.created');
        void this.router.navigate(['/books', listing.id]);
      }
    });
  }

  private toPayload(): ListingFormRequest {
    const values = this.form.getRawValue();
    return {
      title: values.title,
      author: values.author,
      category: values.category,
      condition: values.condition,
      description: values.description,
      listingType: values.listingType,
      status: values.status,
      price: this.isForSale() && values.price ? Number(values.price) : null,
      imageUrls: this.imageUpload().getImageUrls()
    };
  }
}
