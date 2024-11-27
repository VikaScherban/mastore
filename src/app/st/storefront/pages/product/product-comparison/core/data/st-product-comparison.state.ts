import { StProductComparisonData } from './st-product-comparison.data';

export interface StProductComparisonState {
  productData: StProductComparisonData;
  isLoading: boolean;
  error?: unknown;
}

export const defaultProductComparisonData: StProductComparisonData = {
  products: [],
  classifications: []
}

export const initialState: StProductComparisonState = {
  productData: defaultProductComparisonData,
  isLoading: false,
}
