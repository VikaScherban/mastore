import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  stProductComparisonTranslationChunksConfig,
  stProductComparisonTranslations
} from '../../../st/storefront/pages/product/product-comparison/translations';
import {
  ST_PRODUCT_COMPARISON_FEATURE_NAME,
  StProductComparisonRootModule
} from '../../../st/storefront/pages/product/product-comparison/root';

@NgModule({
  imports: [StProductComparisonRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ST_PRODUCT_COMPARISON_FEATURE_NAME]: {
          module: () =>
            import(
              '../../../st/storefront/pages/product/product-comparison/st-product-comparison.module'
              ).then((m) => m.StProductComparisonModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: stProductComparisonTranslations,
        chunks: stProductComparisonTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class StComparisonProductsFeatureModule { }
