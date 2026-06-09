import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-not-found',
  imports: [EmptyStateComponent, MatButtonModule, RouterLink, TranslateModule],
  template: `
    <app-empty-state
      [title]="'errors.notFoundTitle' | translate"
      [message]="'errors.notFoundMessage' | translate"
      icon="search_off"
    />
    <div class="actions">
      <a mat-flat-button routerLink="/books">{{ 'errors.backHome' | translate }}</a>
    </div>
  `,
  styles: `
    .actions {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }
  `
})
export class NotFoundComponent {}
