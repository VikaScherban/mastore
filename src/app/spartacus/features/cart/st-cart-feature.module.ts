import { NgModule } from "@angular/core";
import { CmsConfig, provideConfig } from "@spartacus/core";
import { ST_CART_FEATURE_NAME, StCartRootModule } from "../../../st/storefront/pages/cart/root";

@NgModule({
  imports: [StCartRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ST_CART_FEATURE_NAME]: {
          module: () =>
            import(
              '../../../st/storefront/pages/cart/st-cart.module'
              ).then((m) => m.StCartModule),
        },
      },
    }),
  ],
})
export class StCartFeatureModule { }
