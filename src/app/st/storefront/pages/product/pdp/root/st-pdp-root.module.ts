import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { ST_PDP_FEATURE_NAME } from './st-pdp-feature-name';

export const ST_PDP_CMS_COMPONENTS: string[] = ['AddToComparisonComponent'];

export function defaultStProductDetailsComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [ST_PDP_FEATURE_NAME]: {
        cmsComponents: ST_PDP_CMS_COMPONENTS,
      },
    },
  };
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultStProductDetailsComponentsConfig)],
})
export class StPdpRootModule {}
