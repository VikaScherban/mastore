import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';
import { CmsConfig, FeaturesConfigModule, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { OutletModule, PageComponentModule, SpinnerModule } from '@spartacus/storefront';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';

import { StCheckoutDeliveryModeComponent } from './st-checkout-delivery-mode.component';
import { StCheckoutLayoutComponent } from "../../core/layouts/st-checkout-layout/st-checkout-layout.component";

@NgModule({
  declarations: [
    StCheckoutDeliveryModeComponent
  ],
  imports: [
    CommonModule,
    StCheckoutLayoutComponent,
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
