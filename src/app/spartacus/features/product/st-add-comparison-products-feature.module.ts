import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import { ST_PDP_FEATURE_NAME, StPdpRootModule } from '../../../st/storefront/pages/product/pdp/root';
import {
  stAddProductComparisonTranslationChunksConfig,
  stAddProductComparisonTranslations
} from '../../../st/storefront/pages/product/pdp/translations';

@NgModule({
  imports: [StPdpRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ST_PDP_FEATURE_NAME]: {
          module: () =>
            import(
              '../../../st/storefront/pages/product/pdp/st-pdp.module'
              ).then((m) => m.StPdpModule),
        },
      },
    }),
    provideConfig(<I18nConfig>{
      i18n: {
        resources: stAddProductComparisonTranslations,
        chunks: stAddProductComparisonTranslationChunksConfig,
        fallbackLang: 'en',
      },
    }),
  ],
})
export class StAddComparisonProductsFeatureModule {}
