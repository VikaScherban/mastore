import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { StAddProductComparisonChunksConfig } from './chunks.config';
import { en } from './en';

export const stAddProductComparisonTranslations: TranslationResources = {
  en,
};

export const stAddProductComparisonTranslationChunksConfig: TranslationChunksConfig = {
  stAddProductComparison: [StAddProductComparisonChunksConfig.ADD_PRODUCT_COMPARISON],
};
