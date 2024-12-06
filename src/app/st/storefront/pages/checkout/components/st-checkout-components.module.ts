import { NgModule } from '@angular/core';
import { StCheckoutDeliveryAddressModule } from './delivery-address/st-checkout-delivery-address.module';
import { StCheckoutDeliveryModeModule } from './delivery-mode/st-checkout-delivery-mode.module';
import { StCheckoutPaymentMethodModule } from './payment-method/st-checkout-payment-method.module';
import { StCheckoutReviewOrderModule } from "./review-order/st-checkout-review-order.module";

@NgModule({
  imports: [
    StCheckoutDeliveryAddressModule,
    StCheckoutDeliveryModeModule,
    StCheckoutPaymentMethodModule,
    StCheckoutReviewOrderModule
  ]
})
export class StCheckoutComponentsModule {}
