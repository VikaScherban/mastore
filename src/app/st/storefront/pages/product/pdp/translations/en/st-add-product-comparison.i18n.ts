import { StAddProductComparisonChunksConfig } from '../chunks.config';

export const stAddProductComparison = {
  [StAddProductComparisonChunksConfig.ADD_PRODUCT_COMPARISON]: {
    message: {
      addToComparisonSuccess: 'The product {{ productName }} has been successfully added to comparison',
      addToComparisonWarning: 'This product is already in the comparison list or the list is full. Please go to the comparison page and check the status',
    }
  },
};
