import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { stProductComparisonBackendConfig } from './config';
import { StProductComparisonConnector } from './connectors';

@NgModule({
  providers: [
    provideDefaultConfig(stProductComparisonBackendConfig),
    StProductComparisonConnector
  ],
})
export class StProductComparisonOccModule {}
