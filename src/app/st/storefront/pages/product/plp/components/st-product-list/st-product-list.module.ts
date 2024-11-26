import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, I18nModule, provideDefaultConfig } from '@spartacus/core';
import { defaultViewConfig, PaginationModule, ProductListModule, SortingModule, ViewConfig } from '@spartacus/storefront';
import { StProductListComponent } from './st-product-list.component';
import { StProductGridItemComponent } from './st-product-grid-item/st-product-grid-item.component';
import { StProductListItemComponent } from './st-product-list-item/st-product-list-item.component';

@NgModule({
  declarations: [
    StProductListComponent,
  ],
  imports: [
    CommonModule,
    I18nModule,
    SortingModule,
    PaginationModule,
    ProductListModule,
    StProductGridItemComponent,
    StProductListItemComponent
  ],
  providers: [
    provideDefaultConfig(<ViewConfig>defaultViewConfig),
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        CMSProductListComponent: {
          component: StProductListComponent,
          data: {
            composition: {
              inner: ['ProductAddToCartComponent'],
            },
          },
        },
        ProductGridComponent: {
          component: StProductListComponent,
          data: {
            composition: {
              inner: ['ProductAddToCartComponent'],
            },
          },
        },
        SearchResultsListComponent: {
          component: StProductListComponent,
          data: {
            composition: {
              inner: ['ProductAddToCartComponent'],
            },
          },
        },
      },
    }),
  ]
})
export class StProductListModule { }
