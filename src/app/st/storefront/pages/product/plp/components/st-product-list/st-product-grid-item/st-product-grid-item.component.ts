import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  MediaModule,
  OutletModule,
  PageComponentModule,
  ProductListItemContext,
  ProductListItemContextSource,
  ProductListOutlets,
  StarRatingModule,
} from '@spartacus/storefront';
import { I18nModule, Product, UrlModule } from '@spartacus/core';
import { getMedia } from '../../../../../../helpers/product.helper';
import { StProductListService } from '../../../core/services';

@Component({
  selector: 'st-product-grid-item',
  standalone: true,
  templateUrl: './st-product-grid-item.component.html',
  imports: [
    RouterLink,
    MediaModule,
    UrlModule,
    OutletModule,
    StarRatingModule,
    I18nModule,
    PageComponentModule
  ],
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
})
export class StProductGridItemComponent implements OnChanges {
  protected productListService = inject(StProductListService);
  hideAddToCartButton = false;

  readonly ProductListOutlets = ProductListOutlets;
  @Input() product!: Product;

  constructor(
    protected productListItemContextSource: ProductListItemContextSource
  ) {}

  ngOnChanges(changes?: SimpleChanges): void {
    // @ts-ignore
    if (changes?.product) {
      this.hideAddToCartButton =
        this.productListService.shouldHideAddToCartButton(this.product);
      this.productListItemContextSource.product$.next(this.product);
    }
  }

  protected readonly getMedia = getMedia;
}
