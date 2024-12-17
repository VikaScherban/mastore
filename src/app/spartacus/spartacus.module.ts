import { NgModule } from '@angular/core';
import { BaseStorefrontModule } from "@spartacus/storefront";
import { SpartacusConfigurationModule } from './spartacus-configuration.module';
import { SpartacusFeaturesModule } from './spartacus-features.module';
import { NewCustomModule } from './config/new-custom/new-custom.module';

@NgModule({
  declarations: [],
  imports: [
    BaseStorefrontModule,
    SpartacusFeaturesModule,
    SpartacusConfigurationModule,
    NewCustomModule,
  ],
  exports: [BaseStorefrontModule]
})
export class SpartacusModule { }
