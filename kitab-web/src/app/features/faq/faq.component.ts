import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-faq',
  imports: [MatExpansionModule, TranslateModule, PageHeaderComponent],
  template: `
    <app-page-header
      title="Frequently Asked Questions"
      description="Find answers to common questions about buying, selling, and exchanging on Kitab."
      icon="help"
    />

    <div class="faq-content">
      <mat-accordion multi>
        <mat-expansion-panel class="surface">
          <mat-expansion-panel-header>
            <mat-panel-title>
              How does book exchanging work?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>
            When you find a book listed "For Exchange", you can send a contact request to the owner. 
            In your request, you can select one of your own available listings to offer in return. 
            If the owner accepts your request, you both can coordinate the delivery/shipping of the books!
          </p>
        </mat-expansion-panel>

        <mat-expansion-panel class="surface">
          <mat-expansion-panel-header>
            <mat-panel-title>
              Is Kitab free to use?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>
            Yes! Kitab is completely free to use. Our goal is to connect readers and make books more accessible. 
            Any shipping or delivery costs for exchanges are coordinated directly between the users.
          </p>
        </mat-expansion-panel>

        <mat-expansion-panel class="surface">
          <mat-expansion-panel-header>
            <mat-panel-title>
              How do I ensure a safe exchange?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>
            We recommend exchanging books in safe, public locations if meeting in person. For shipped books, 
            communicate clearly with the other party and use trackable shipping methods when possible to ensure 
            both parties receive their items.
          </p>
        </mat-expansion-panel>

        <mat-expansion-panel class="surface">
          <mat-expansion-panel-header>
            <mat-panel-title>
              Can I list books in any language?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>
            Absolutely! Kitab is a global platform. You can list books in English, Arabic, or any other language. 
            Just make sure to specify the language in the book description so buyers know what they are getting.
          </p>
        </mat-expansion-panel>

        <mat-expansion-panel class="surface">
          <mat-expansion-panel-header>
            <mat-panel-title>
              How do I report an issue with a user?
            </mat-panel-title>
          </mat-expansion-panel-header>
          <p>
            If you encounter any issues with inappropriate listings or behavior, please use the Contact Us page 
            to reach out to our administration team. We take community safety very seriously.
          </p>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: `
    .faq-content {
      margin: 0 auto;
      max-width: 800px;
    }

    mat-expansion-panel {
      margin-bottom: 16px;
    }

    mat-panel-title {
      font-size: 1.1rem;
      font-weight: 500;
    }

    mat-expansion-panel p {
      color: var(--kitab-text);
      line-height: 1.6;
      margin: 0;
      padding-top: 8px;
    }
  `
})
export class FaqComponent {}
