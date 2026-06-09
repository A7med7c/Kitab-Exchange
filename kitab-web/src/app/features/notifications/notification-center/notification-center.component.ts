import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-notification-center',
  imports: [EmptyStateComponent, PageHeaderComponent, TranslateModule],
  template: `
    <app-page-header
      [title]="'notifications.title' | translate"
      [description]="'notifications.description' | translate"
      icon="notifications"
    />
    <app-empty-state
      [title]="'notifications.emptyTitle' | translate"
      [message]="'notifications.emptyMessage' | translate"
      icon="notifications_none"
    />
  `
})
export class NotificationCenterComponent {}
