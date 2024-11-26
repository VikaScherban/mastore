import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  MediaModule, OutletModule, PageComponentModule,
  ProductListItemContext,
  ProductListItemContextSource,
  ProductListOutlets, StarRatingModule
} from '@spartacus/storefront';
import { FeaturesConfigModule, I18nModule, Product, UrlModule, useFeatureStyles } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { StProductListService } from '../../../core/services';
import { getMedia } from '../../../../../../helpers/product.helper';

@Component({
  selector: 'st-product-list-item',
  standalone: true,
  templateUrl: './st-product-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
  imports: [
    I18nModule,
    RouterLink,
    UrlModule,
    MediaModule,
    FeaturesConfigModule,
    OutletModule,
    StarRatingModule,
    PageComponentModule
  ]
})
export class StProductListItemComponent implements OnChanges {
  protected productListService = inject(StProductListService);
  hideAddToCartButton = false;

  readonly ProductListOutlets = ProductListOutlets;
  @Input() product!: Product;

  constructor(
    protected productListItemContextSource: ProductListItemContextSource
  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  ngOnChanges(changes?: SimpleChanges): void {
    // @ts-ignore
    if (changes?.product) {
      this.hideAddToCartButton = this.hideAddToCartButton =
        this.productListService.shouldHideAddToCartButton(this.product);
      this.productListItemContextSource.product$.next(this.product);
    }
  }

  protected readonly getMedia = getMedia;
}
