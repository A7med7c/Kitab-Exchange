import { HttpEventType } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface UploadedImage {
  url: string;
  previewUrl: string;
}

@Component({
  selector: 'app-image-upload',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, TranslateModule],
  template: `
    <section
      class="upload-zone surface"
      [class.dragging]="dragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        #fileInput
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        multiple
        hidden
        (change)="onFileSelected($event)"
      />
      <mat-icon aria-hidden="true">cloud_upload</mat-icon>
      <p>{{ 'books.form.imagesHint' | translate }}</p>
      <button mat-stroked-button type="button" (click)="fileInput.click()" [disabled]="uploading()">
        <mat-icon aria-hidden="true">add_photo_alternate</mat-icon>
        <span>{{ 'books.form.chooseImages' | translate }}</span>
      </button>
    </section>

    @if (uploading()) {
      <mat-progress-bar mode="indeterminate" />
    }

    @if (images().length) {
      <div class="preview-grid">
        @for (image of images(); track image.url; let index = $index) {
          <figure class="preview-card">
            <img [src]="image.previewUrl" [alt]="'books.form.imagePreview' | translate" />
            <button mat-icon-button type="button" (click)="removeImage(index)" [attr.aria-label]="'common.delete' | translate">
              <mat-icon>close</mat-icon>
            </button>
          </figure>
        }
      </div>
    }
  `,
  styles: `
    .upload-zone {
      align-items: center;
      border: 2px dashed color-mix(in srgb, var(--kitab-accent) 35%, transparent);
      border-radius: var(--kitab-radius);
      display: grid;
      gap: 8px;
      justify-items: center;
      padding: 24px;
      text-align: center;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .upload-zone.dragging {
      background: color-mix(in srgb, var(--kitab-accent) 8%, transparent);
      border-color: var(--kitab-accent);
    }

    .preview-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      margin-top: 16px;
    }

    .preview-card {
      margin: 0;
      position: relative;
    }

    .preview-card img {
      border-radius: 12px;
      display: block;
      height: 120px;
      object-fit: cover;
      width: 100%;
    }

    .preview-card button {
      position: absolute;
      right: 4px;
      top: 4px;
    }
  `
})
export class ImageUploadComponent {
  private readonly api = inject(ApiService);
  private readonly notifications = inject(NotificationService);

  readonly initialUrls = input<string[]>([]);

  protected readonly images = signal<UploadedImage[]>([]);
  protected readonly uploading = signal(false);
  protected readonly dragging = signal(false);
  private initialized = false;

  constructor() {
    effect(() => {
      const urls = this.initialUrls();
      if (!this.initialized && urls.length) {
        this.images.set(
          urls.map((url) => ({
            url,
            previewUrl: this.api.resolveAssetUrl(url)
          }))
        );
        this.initialized = true;
      }
    });
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.uploadFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  protected removeImage(index: number): void {
    this.images.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  getImageUrls(): string[] {
    return this.images().map((image) => image.url);
  }

  private uploadFiles(files: File[]): void {
    const allowed = files.filter((file) => this.isAllowedImage(file));
    if (!allowed.length) {
      return;
    }

    for (const file of allowed) {
      this.uploading.set(true);
      this.api
        .uploadListingImage(file)
        .pipe(
          catchError(() => {
            this.notifications.error('books.form.imageUploadFailed');
            return of(null);
          }),
          finalize(() => this.uploading.set(false))
        )
        .subscribe((event) => {
          if (!event) {
            return;
          }

          if (event.type === HttpEventType.Response && event.body?.url) {
            this.images.update((items) => [
              ...items,
              {
                url: event.body!.url,
                previewUrl: this.api.resolveAssetUrl(event.body!.url)
              }
            ]);
          }
        });
    }
  }

  private isAllowedImage(file: File): boolean {
    return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
  }
}
