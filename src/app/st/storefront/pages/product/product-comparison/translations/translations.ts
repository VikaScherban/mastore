import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { StProductComparisonChunksConfig } from './chunks.config';
import { en } from './en';

export const stProductComparisonTranslations: TranslationResources = {
  en,
};

export const stProductComparisonTranslationChunksConfig: TranslationChunksConfig = {
  stProductComparison: [StProductComparisonChunksConfig.PRODUCT_COMPARISON],
};
