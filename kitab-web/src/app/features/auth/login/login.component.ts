import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule
  ],
  template: `
    <section class="auth-page">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ 'auth.login' | translate }}</mat-card-title>
          <mat-card-subtitle>{{ 'auth.loginSubtitle' | translate }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field>
              <mat-label>{{ 'auth.email' | translate }}</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>{{ 'auth.password' | translate }}</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>
            <button mat-flat-button type="submit" [disabled]="form.invalid">
              <mat-icon aria-hidden="true">login</mat-icon>
              <span>{{ 'auth.login' | translate }}</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button routerLink="/register">{{ 'auth.createAccount' | translate }}</a>
        </mat-card-actions>
      </mat-card>
    </section>
  `,
  styles: `
    .auth-page {
      display: grid;
      min-height: calc(100dvh - 112px);
      place-items: center;
    }

    mat-card {
      border-radius: var(--kitab-radius);
      width: min(100%, 440px);
    }

    form {
      display: grid;
      gap: 16px;
      margin-top: 16px;
    }
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.auth.login(this.form.getRawValue()).subscribe(() => {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      if (returnUrl) {
        void this.router.navigateByUrl(returnUrl);
      } else if (this.auth.isAdmin()) {
        void this.router.navigateByUrl('/admin');
      } else {
        void this.router.navigateByUrl('/dashboard');
      }
    });
  }
}
