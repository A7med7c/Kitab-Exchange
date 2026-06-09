import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  success(messageKey: string): void {
    this.open(messageKey, 3500);
  }

  error(messageKey: string): void {
    this.open(messageKey, 5000);
  }

  message(text: string): void {
    this.snackBar.open(text, this.translate.instant('common.close'), { duration: 4500 });
  }

  private open(messageKey: string, duration: number): void {
    this.snackBar.open(this.translate.instant(messageKey), this.translate.instant('common.close'), { duration });
  }
}
