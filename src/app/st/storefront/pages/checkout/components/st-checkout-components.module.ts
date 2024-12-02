import { NgModule } from '@angular/core';
import { StCheckoutDeliveryAddressModule } from './delivery-address/st-checkout-delivery-address.module';
import { StCheckoutDeliveryModeModule } from './delivery-mode/st-checkout-delivery-mode.module';

@NgModule({
  imports: [
    StCheckoutDeliveryAddressModule,
    StCheckoutDeliveryModeModule
  ]
})
export class StCheckoutComponentsModule {}
