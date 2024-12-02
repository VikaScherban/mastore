import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { CartNotEmptyGuard, CheckoutAuthGuard, CheckoutPaymentFormModule } from '@spartacus/checkout/base/components';
import { CardModule, SpinnerModule } from '@spartacus/storefront';

import { StCheckoutPaymentMethodComponent } from './st-checkout-payment-method.component';
import {
  StCheckoutLayoutComponent
} from '../../core/layouts/st-checkout-layout/st-checkout-layout.component';

@NgModule({
  declarations: [
    StCheckoutPaymentMethodComponent
  ],
  exports: [
    StCheckoutPaymentMethodComponent
  ],
  imports: [
    CommonModule,
    StCheckoutLayoutComponent,
    SpinnerModule,
    FeaturesConfigModule,
    I18nModule,
    CheckoutPaymentFormModule,
    CardModule
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutPaymentDetails: {
          component: StCheckoutPaymentMethodComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
})
export class StCheckoutPaymentMethodModule { }
