import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Observable, switchMap, tap } from 'rxjs';

import {
  defaultProductComparisonData,
  initialState,
  StProductComparisonData,
  StProductComparisonState
} from '../core/data';
import { StProductComparisonConnector } from '../occ/connectors';

@Injectable()
export class StProductComparisonStore extends ComponentStore<StProductComparisonState> {

  readonly data$: Observable<StProductComparisonData> = this.select((state) => state?.productData);
  readonly isLoading$: Observable<boolean> = this.select((state) => state?.isLoading);

  readonly loadProductsComparison = this.effect<string>((products$) =>
    products$.pipe(
      tap(() => this.updateLoadDataInProcess()),
      switchMap((products: string) =>
        this.connector.load(products).pipe(
          tapResponse(
            (res) => this.updateLoadDataSuccess(res),
            (error) => this.updateLoadDataFail(error),
          ),
        ),
      ),
    ),
  );

  readonly clearData = this.updater(
    (state): StProductComparisonState => ({ ...initialState }),
  );

  private readonly updateLoadDataInProcess = this.updater(
    (state): StProductComparisonState => ({
      ...state,
      isLoading: true,
    }),
  );

  private readonly updateLoadDataSuccess = this.updater(
    (state, productData: StProductComparisonData): StProductComparisonState => ({
      ...state,
      productData,
      isLoading: false,
      error: undefined
    }),
  );

  private readonly updateLoadDataFail = this.updater(
    (state, error: unknown): StProductComparisonState => ({
      ...state,
      productData: defaultProductComparisonData,
      isLoading: false,
      error
    }),
  );

  constructor(private connector: StProductComparisonConnector) {
    super(initialState);
  }
}
