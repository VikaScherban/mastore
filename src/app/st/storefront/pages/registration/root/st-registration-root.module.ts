import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from "@spartacus/core";
import { ST_REGISTRATION_FEATURE_NAME } from "./st-registration-feature-name";

export const ST_REGISTRATION_CMS_COMPONENTS: string[] = ['ReturningCustomerLoginComponent', 'ReturningCustomerRegisterComponent', 'LoginComponent', 'RegisterCustomerComponent'];

export function defaultStRegistrationComponentsConfig(): CmsConfig {
  return {
    featureModules: {
      [ST_REGISTRATION_FEATURE_NAME]: {
        cmsComponents: ST_REGISTRATION_CMS_COMPONENTS,
      },
    },
  };
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultStRegistrationComponentsConfig)],
})
export class StRegistrationRootModule { }
