import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule, provideConfig, provideDefaultConfig} from '@spartacus/core';
import { CartValidationWarningsModule } from '@spartacus/cart/base/components';
import { LayoutConfig, PromotionsModule, provideOutlet } from '@spartacus/storefront';
import { CartOutlets } from '@spartacus/cart/base/root';

import { StWrapperCartComponent } from './st-wrapper-cart.component';
import { StCartItemsComponent } from './st-cart-items/st-cart-items.component';
import { StCartActionsComponent } from './st-cart-actions/st-cart-actions.component';

declare module '@spartacus/cart/base/root' {
  enum CartOutlets {
    ST_LIST_ITEM = 'st-cart-item-list-row',
  }
}

export const stCartLayoutSlotsConfig = {
  CartPageTemplate: {
    slots: [
      'TopContent',
      'CenterRightContentSlot',
      'EmptyCartMiddleContent',
      'BottomContentSlot',
    ]
  }
}

@NgModule({
  declarations: [
    StWrapperCartComponent,
  ],
  imports: [
    CommonModule,
    CartValidationWarningsModule,
    I18nModule,
    PromotionsModule,
    StCartItemsComponent,
    StCartActionsComponent
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        CartComponent: {
          component: StWrapperCartComponent,
        }
      },
    }),
    provideOutlet({
      id: CartOutlets.CART_ITEM_LIST,
      component: StCartItemsComponent,
    }),
    provideConfig(<LayoutConfig>{
      layoutSlots: stCartLayoutSlotsConfig
    }),
  ]
})
export class StWrapperCartModule { }
