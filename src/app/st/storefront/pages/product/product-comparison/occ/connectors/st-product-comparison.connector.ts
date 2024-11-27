import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StOccConnector } from '../../../../../core/occ/connectors';
import { StProductComparisonData } from '../../core/data';
import { stProductComparisonEndpointName } from '../config/st-product-comparison-endpoints.config';

@Injectable()
export class StProductComparisonConnector {

  constructor(private occ: StOccConnector) {}

  load(products: string): Observable<StProductComparisonData> {
    return this.occ.get<StProductComparisonData>(
      stProductComparisonEndpointName.stProductComparisonList,
      { products }
    );
  }
}
