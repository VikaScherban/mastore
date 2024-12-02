import { NgModule } from '@angular/core';
import { StCheckoutDeliveryAddressModule } from './delivery-address/st-checkout-delivery-address.module';
import { StCheckoutDeliveryModeModule } from './delivery-mode/st-checkout-delivery-mode.module';
import { StCheckoutPaymentMethodModule } from './payment-method/st-checkout-payment-method.module';

@NgModule({
  imports: [
    StCheckoutDeliveryAddressModule,
    StCheckoutDeliveryModeModule,
    StCheckoutPaymentMethodModule,
  ]
})
export class StCheckoutComponentsModule {}
