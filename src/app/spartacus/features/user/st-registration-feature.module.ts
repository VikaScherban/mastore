import { NgModule } from "@angular/core";
import { CmsConfig, provideConfig } from "@spartacus/core";
import { ST_REGISTRATION_FEATURE_NAME, StRegistrationRootModule } from "../../../st/storefront/pages/registration/root";

@NgModule({
  imports: [StRegistrationRootModule],
  providers: [
    provideConfig(<CmsConfig>{
      featureModules: {
        [ST_REGISTRATION_FEATURE_NAME]: {
          module: () =>
            import(
              '../../../st/storefront/pages/registration/st-registration.module'
              ).then((m) => m.StRegistrationModule),
        },
      },
    }),
  ],
})
export class StRegistrationFeatureModule {}
