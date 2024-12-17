import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, I18nModule, provideDefaultConfig, UrlModule} from '@spartacus/core';
import { RouterLink} from '@angular/router';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { CardModule, IconModule, OutletModule, PromotionsModule, provideOutlet} from '@spartacus/storefront';
import { CartOutlets} from '@spartacus/cart/base/root';
import { StCheckoutReviewPaymentComponent } from './st-checkout-review-payment/st-checkout-review-payment.component';
import { StCheckoutReviewShippingComponent } from './st-checkout-review-shipping/st-checkout-review-shipping.component';
import { StCheckoutReviewOverviewComponent } from './st-checkout-review-overview/st-checkout-review-overview.component';
import { StCartItemListComponent } from './st-cart-item-list/st-cart-item-list.component';
import {CartBaseComponentsModule} from "@spartacus/cart/base/components";

declare module '@spartacus/cart/base/root' {
  enum CartOutlets {
    ST_CART_ITEM_LIST = 'st-cart-item-list',
  }
}

@NgModule({
  declarations: [
    StCheckoutReviewPaymentComponent,
    StCheckoutReviewShippingComponent,
    StCheckoutReviewOverviewComponent,
    StCartItemListComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    I18nModule,
    UrlModule,
    RouterLink,
    IconModule,
    PromotionsModule,
    OutletModule,
    CartBaseComponentsModule
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutReviewPayment: {
          component: StCheckoutReviewPaymentComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
        CheckoutReviewShipping: {
          component: StCheckoutReviewShippingComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
        CheckoutReviewOverview: {
          component: StCheckoutReviewOverviewComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
    provideOutlet({
      id: CartOutlets.ST_CART_ITEM_LIST,
      component: StCartItemListComponent,
    }),
  ],
})
export class StCheckoutReviewOrderModule { }
