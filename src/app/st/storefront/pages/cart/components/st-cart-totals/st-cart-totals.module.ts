import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideDefaultConfig } from '@spartacus/core';
import { StCartTotalsComponent } from './st-cart-totals.component';
import {CartSharedModule} from "@spartacus/cart/base/components";

@NgModule({
  declarations: [
    StCartTotalsComponent
  ],
  imports: [
    CommonModule,
    CartSharedModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CartTotalsComponent: {
          component: StCartTotalsComponent,
        }
      },
    }),
  ]
})
export class StCartTotalsModule { }
