import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { ST_PRODUCT_COMPARISON_FEATURE_NAME } from './st-product-comparison-feature-name';
import { StProductComparisonOccModule } from '../occ';

export const ST_PRODUCT_COMPARISON_CMS_COMPONENTS: string[] = ['ProductComparisonComponent'];

export function defaultStProductListComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [ST_PRODUCT_COMPARISON_FEATURE_NAME]: {
        cmsComponents: ST_PRODUCT_COMPARISON_CMS_COMPONENTS,
      },
    },
  };
}

@NgModule({
  imports: [StProductComparisonOccModule],
  providers: [provideDefaultConfigFactory(defaultStProductListComponentsConfig)],
})
export class StProductComparisonRootModule {}
