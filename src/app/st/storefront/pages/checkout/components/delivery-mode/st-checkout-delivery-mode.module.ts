import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { OutletModule, PageComponentModule, SpinnerModule } from '@spartacus/storefront';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';

import { StCheckoutDeliveryModeComponent } from './st-checkout-delivery-mode.component';
import {
  StCheckoutLayoutHeaderComponent
} from '../../core/layouts/st-checkout-layout-header/st-checkout-layout-header.component';

@NgModule({
  declarations: [
    StCheckoutDeliveryModeComponent
  ],
  imports: [
    CommonModule,
    StCheckoutLayoutHeaderComponent,
    FeaturesConfigModule,
    I18nModule,
    ReactiveFormsModule,
    SpinnerModule,
    OutletModule,
    PageComponentModule
  ],
  exports: [StCheckoutDeliveryModeComponent],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutDeliveryMode: {
          component: StCheckoutDeliveryModeComponent,
          data: {
            composition: {
              inner: ['PickupInStoreDeliveryModeComponent'],
            },
          },
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
})
export class StCheckoutDeliveryModeModule { }
