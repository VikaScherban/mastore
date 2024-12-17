import { OccConfig } from '@spartacus/core';
import { stProductComparisonEndpointConfig } from './st-product-comparison-endpoints.config';

export const stProductComparisonBackendConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        ...stProductComparisonEndpointConfig,
      },
    },
  },
}
