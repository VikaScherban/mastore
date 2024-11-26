import { NgModule } from "@angular/core";
import { CmsConfig, provideConfig } from "@spartacus/core";
import { ST_PLP_FEATURE_NAME, StPlpRootModule } from "../../../st/storefront/pages/product/plp/root";

@NgModule({
  imports: [StPlpRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ST_PLP_FEATURE_NAME]: {
          module: () =>
            import(
              '../../../st/storefront/pages/product/plp/st-plp.module'
              ).then((m) => m.StPlpModule),
        },
      },
    }),
  ],
})
export class StPlpFeatureModule {}
