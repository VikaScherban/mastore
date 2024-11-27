import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideDefaultConfig } from '@spartacus/core';
import { StAddToComparisonComponent } from './st-add-to-comparison.component';

@NgModule({
  declarations: [StAddToComparisonComponent],
  imports: [CommonModule],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        AddToComparisonComponent: {
          component: StAddToComparisonComponent,
        }
      },
    }),
  ]
})
export class StAddToComparisonModule { }
