// System Utils
import { Injectable } from '@angular/core';

// Installed Utils
import { TranslateService } from '@ngx-translate/core';

// Configuration
@Injectable({
  providedIn: 'root'
})

// Logic
export class UtilsService {
  constructor(
    private translateService: TranslateService
  ) {}

  formatDate = ( dateStr: string ): string => {
    return dateStr.split("T")[0];
  }

  monthText = (month: number): string => {

    // Months list
    const months: {[key: number]: string} = {
      1: this.translateService.instant('jan'),
      2: this.translateService.instant('feb'),
      3: this.translateService.instant('mar'),
      4: this.translateService.instant('apr'),
      5: this.translateService.instant('may'),
      6: this.translateService.instant('jun'),
      7: this.translateService.instant('jul'),
      8: this.translateService.instant('aug'),
      9: this.translateService.instant('sep'),
      10: this.translateService.instant('oct'),
      11: this.translateService.instant('nov'),
      12: this.translateService.instant('dec')
    };

    return (typeof months[month] !== 'undefined')?months[month]:'';

  }

  uniqueId = (): string => {
    const stringArr = [];
    for (let s = 0; s < 5; s++) {
      stringArr.push((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
    }
    return stringArr.join('-');
  }

}
