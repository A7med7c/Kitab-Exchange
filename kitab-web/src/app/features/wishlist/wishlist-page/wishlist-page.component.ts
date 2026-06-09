import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-wishlist-page',
  imports: [EmptyStateComponent, PageHeaderComponent, TranslateModule],
  template: `
    <app-page-header
      [title]="'wishlist.title' | translate"
      [description]="'wishlist.description' | translate"
      icon="favorite"
    />
    <app-empty-state [title]="'wishlist.emptyTitle' | translate" [message]="'wishlist.emptyMessage' | translate" />
  `
})
export class WishlistPageComponent {}
