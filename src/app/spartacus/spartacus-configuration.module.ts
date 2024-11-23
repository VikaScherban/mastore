import { NgModule } from '@angular/core';
import { translationChunksConfig, translations } from "@spartacus/assets";
import {
  AuthConfig,
  FeaturesConfig,
  I18nConfig,
  OccConfig,
  provideConfig,
  SiteContextConfig
} from "@spartacus/core";
import { defaultCmsContentProviders, layoutConfig, mediaConfig } from "@spartacus/storefront";
import { stLayoutConfig } from "./config/st-config";

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    provideConfig(layoutConfig),
    provideConfig(mediaConfig),
    ...defaultCmsContentProviders,
    provideConfig(<OccConfig>{
    backend: {
      occ: {
        baseUrl: 'https://localhost:9002',
        prefix: 'spartacustrainingcommercewebservices/v2'
      }
    },
  }), provideConfig(<SiteContextConfig>{
    context: {
      urlParameters: ['baseSite', 'language', 'currency'],
      baseSite: ['electronics-spa','apparel-uk-spa'],
      currency: ['USD', 'GBP',]
    },
  }),
    provideConfig(<AuthConfig>{
      authentication: {
        client_id: 'mobile_android',
        client_secret: 'secret',
        OAuthLibConfig: {
          requireHttps: true,
          scope: 'basic'
        }
      },
    }),
    provideConfig(<I18nConfig>{
    i18n: {
      resources: translations,
      chunks: translationChunksConfig,
      fallbackLang: 'en'
    },
  }),
    provideConfig(<FeaturesConfig>{
    features: {
      level: '2211.27'
    }
  }),
    provideConfig(stLayoutConfig),
  ]
})
export class SpartacusConfigurationModule { }
