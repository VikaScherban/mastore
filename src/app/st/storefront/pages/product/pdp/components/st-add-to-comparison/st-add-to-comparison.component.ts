import { Component, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrentProductService } from '@spartacus/storefront';
import { GlobalMessageService, GlobalMessageType, isNotNullable } from '@spartacus/core';
import { filter, map } from 'rxjs';

import { ComparisonProductsStatePersistenceService } from '../../../../../core/persistence';
import { ComparisonProductService } from '../../../../../core/services';

@Component({
  selector: 'st-add-to-comparison',
  templateUrl: './st-add-to-comparison.component.html',
  styleUrl: './st-add-to-comparison.component.scss'
})
export class StAddToComparisonComponent implements OnInit {

  private readonly productName = toSignal<string>(
    this.currentProductService.getProduct()
      .pipe(
        filter(isNotNullable),
        map(product => product.name as string)
      )
  );

  readonly productCode = toSignal<string>(
    this.currentProductService.getProduct()
      .pipe(
        filter(isNotNullable),
        map(product => product.code as string)
      )
  );

  constructor(
    private globalMessageService: GlobalMessageService,
    private currentProductService: CurrentProductService,
    private comparisonProductService: ComparisonProductService,
    private comparisonProductsStatePersistenceService: ComparisonProductsStatePersistenceService
    ) {
  }

  ngOnInit(): void {
    this.comparisonProductsStatePersistenceService.initSync();
  }

  addToComparison(): void {
    if (this.comparisonProductService.canAdd(this.productCode())) {
      this.comparisonProductService.add(this.productCode());
      this.showSuccessMessage();
    } else {
      this.showWarningMessage();
    }
  }

  private showSuccessMessage(): void {
    this.globalMessageService.add(
      {
        key: 'stAddProductComparison.message.addToComparisonSuccess',
        params: { productName: this.productName() }
      },
      GlobalMessageType.MSG_TYPE_CONFIRMATION,
      5000,
    );
  }

  private showWarningMessage(): void {
    this.globalMessageService.add(
      {
        key: 'stAddProductComparison.message.addToComparisonWarning',
      },
      GlobalMessageType.MSG_TYPE_WARNING,
      5000,
    );
  }
}
