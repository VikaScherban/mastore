import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemComponent, CartItemContextSource, CartItemListComponentService } from '@spartacus/cart/base/components';
import { CartItemContext} from '@spartacus/cart/base/root';
import {
  AtMessageModule,
  ItemCounterModule,
  MediaContainer,
  MediaModule,
  OutletModule,
  PromotionsModule
} from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { I18nModule, Image, ImageGroup, Product, UrlModule } from '@spartacus/core';

@Component({
  selector: '[st-cart-item-list-row], st-cart-item-list-row',
  standalone: true,
  templateUrl: './st-cart-item-list-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CartItemContextSource,
    {provide: CartItemContext, useExisting: CartItemContextSource},
  ],
  imports: [
    CommonModule,
    OutletModule,
    RouterLink,
    UrlModule,
    MediaModule,
    I18nModule,
    PromotionsModule,
    ItemCounterModule,
    AtMessageModule
  ]
})
export class StCartItemListRowComponent extends CartItemComponent {
  protected componentService = inject(CartItemListComponentService);
  isFlagQuote = this.componentService.showBasePriceWithDiscount();
  constructor(cartItemContextSource: CartItemContextSource) {
    super(cartItemContextSource);
  }

  getMedia(product: Product): MediaContainer
    | Image
    | ImageGroup
    | ImageGroup[]
    | undefined {
    // @ts-ignore
    return product?.images?.PRIMARY;
  }
}
