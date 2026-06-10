import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { CategoriesService } from '../../../core/services/categories.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { Category } from '../../../shared/models/api.models';

@Component({
  selector: 'app-delete-category-dialog',
  imports: [MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'admin.categories.deleteTitle' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'admin.categories.deleteMessage' | translate:{ name: data.name } }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button type="button" [mat-dialog-close]="true">{{ 'common.delete' | translate }}</button>
    </mat-dialog-actions>
  `
})
export class DeleteCategoryDialogComponent {
  readonly data = inject<{ name: string }>(MAT_DIALOG_DATA);
}

@Component({
  selector: 'app-category-admin',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    SkeletonLoaderComponent,
    TranslateModule
  ],
  template: `
    <app-page-header
      [title]="'admin.categories.title' | translate"
      [description]="'admin.categories.description' | translate"
      icon="category"
    />

    <form class="category-form surface" [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field>
        <mat-label>{{ 'admin.categories.name' | translate }}</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>
      <mat-form-field>
        <mat-label>{{ 'admin.categories.descriptionLabel' | translate }}</mat-label>
        <input matInput formControlName="description" />
      </mat-form-field>
      <button mat-flat-button type="submit" [disabled]="form.invalid || saving()">
        <mat-icon aria-hidden="true">{{ editingId() ? 'save' : 'add' }}</mat-icon>
        <span>{{ (editingId() ? 'common.save' : 'admin.categories.add') | translate }}</span>
      </button>
      @if (editingId()) {
        <button mat-button type="button" (click)="cancelEdit()">{{ 'common.cancel' | translate }}</button>
      }
    </form>

    @if (loading()) {
      <app-skeleton-loader [count]="2" />
    } @else {
      <table mat-table [dataSource]="categoriesService.categories()" class="surface category-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'admin.categories.name' | translate }}</th>
          <td mat-cell *matCellDef="let category">{{ category.name }}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>{{ 'admin.categories.descriptionLabel' | translate }}</th>
          <td mat-cell *matCellDef="let category">{{ category.description }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-cell"></th>
          <td mat-cell *matCellDef="let category" class="actions-cell">
            <div class="actions-wrapper">
              <button mat-icon-button type="button" (click)="startEdit(category)" [attr.aria-label]="'common.edit' | translate">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button type="button" (click)="remove(category)" [attr.aria-label]="'common.delete' | translate">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    }
  `,
  styles: `
    .category-form {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      margin-bottom: 20px;
      padding: 16px;
    }

    .category-table {
      width: 100%;
      table-layout: fixed;
    }

    .mat-column-name {
      width: 200px;
    }

    .mat-column-description {
      width: auto;
    }

    .actions-cell {
      width: 120px;
      padding-inline-end: 16px;
    }

    .actions-wrapper {
      display: flex;
      gap: 4px;
      justify-content: flex-end;
      white-space: nowrap;
    }
  `
})
export class CategoryAdminComponent {
  protected readonly categoriesService = inject(CategoriesService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);

  protected readonly displayedColumns = ['name', 'description', 'actions'];
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  constructor() {
    this.categoriesService.loadCategories().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }

    const values = this.form.getRawValue();
    this.saving.set(true);
    const editingId = this.editingId();

    const request$ = editingId
      ? this.categoriesService.updateCategory(editingId, values)
      : this.categoriesService.createCategory(values);

    request$.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.notifications.success(editingId ? 'admin.categories.updated' : 'admin.categories.created');
        this.form.reset({ name: '', description: '' });
        this.editingId.set(null);
      }
    });
  }

  protected startEdit(category: Category): void {
    this.editingId.set(category.id);
    this.form.patchValue({
      name: category.name,
      description: category.description ?? ''
    });
  }

  protected cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '' });
  }

  protected remove(category: Category): void {
    const dialogRef = this.dialog.open(DeleteCategoryDialogComponent, {
      width: '420px',
      data: { name: category.name }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.categoriesService.deleteCategory(category.id).subscribe({
        next: () => this.notifications.success('admin.categories.deleted')
      });
    });
  }
}
