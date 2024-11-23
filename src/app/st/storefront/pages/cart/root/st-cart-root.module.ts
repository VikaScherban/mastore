import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { ST_CART_FEATURE_NAME } from './st-cart-feature-name';

export const ST_CART_CMS_COMPONENTS: string[] = ['CartComponent', 'CartTotalsComponent'];

export function defaultStCartComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [ST_CART_FEATURE_NAME]: {
        cmsComponents: ST_CART_CMS_COMPONENTS,
      },
    },
  };
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultStCartComponentsConfig)],
})
export class StCartRootModule { }
