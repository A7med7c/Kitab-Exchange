import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationService } from '../../core/services/notification.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-contact',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="Contact Us"
      description="Have a question or feedback? We'd love to hear from you."
      icon="mail"
    />

    <div class="contact-content">
      <mat-card class="surface">
        <mat-card-content>
          <form class="contact-form" [formGroup]="form" (ngSubmit)="submit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="John Doe" />
                @if (form.controls.name.hasError('required')) {
                  <mat-error>Name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="john@example.com" />
                @if (form.controls.email.hasError('required')) {
                  <mat-error>Email is required</mat-error>
                }
                @if (form.controls.email.hasError('email')) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Subject</mat-label>
              <input matInput formControlName="subject" placeholder="How can we help?" />
              @if (form.controls.subject.hasError('required')) {
                <mat-error>Subject is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="message-field">
              <mat-label>Message</mat-label>
              <textarea matInput formControlName="message" rows="6" placeholder="Your message here..."></textarea>
              @if (form.controls.message.hasError('required')) {
                <mat-error>Message is required</mat-error>
              }
            </mat-form-field>

            <div class="form-actions">
              <button mat-flat-button type="submit" [disabled]="form.invalid || submitting">
                Send Message
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .contact-content {
      margin: 0 auto;
      max-width: 800px;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .form-row {
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 600px) {
      .form-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .message-field {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    mat-form-field {
      width: 100%;
    }
  `
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  submitting = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    // Simulate API call
    setTimeout(() => {
      this.submitting = false;
      this.notifications.success('Thank you for reaching out! We will get back to you soon.');
      this.form.reset();
    }, 1000);
  }
}
