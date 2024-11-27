import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule, provideDefaultConfig } from '@spartacus/core';
import { SpinnerModule} from '@spartacus/storefront';
import { StProductComparisonComponent } from './components/st-product-comparison/st-product-comparison.component';

@NgModule({
  declarations: [
    StProductComparisonComponent
  ],
  imports: [
    CommonModule,
    I18nModule,
    SpinnerModule,
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ProductComparisonComponent: {
          component: StProductComparisonComponent,
        }
      },
    }),
  ]
})
export class StProductComparisonModule { }
