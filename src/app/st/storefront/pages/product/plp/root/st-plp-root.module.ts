import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { ST_PLP_FEATURE_NAME } from './st-plp-feature-name';

export const ST_PLP_CMS_COMPONENTS: string[] = ['CMSProductListComponent'];

export function defaultStProductListComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [ST_PLP_FEATURE_NAME]: {
        cmsComponents: ST_PLP_CMS_COMPONENTS,
      },
    },
  };
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultStProductListComponentsConfig)],
})
export class StPlpRootModule { }
