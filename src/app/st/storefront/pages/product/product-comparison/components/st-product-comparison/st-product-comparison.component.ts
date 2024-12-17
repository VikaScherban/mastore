import { ChangeDetectionStrategy, Component, DestroyRef, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { OccConfig, Product } from '@spartacus/core';

import { StProductComparisonStore } from '../../store';
import { ComparisonProductService } from '../../../../../core/services';
import { ComparisonProductsStatePersistenceService } from '../../../../../core/persistence';
import { getImage } from '../../../../../helpers/product.helper';

@Component({
  selector: 'st-product-comparison',
  templateUrl: './st-product-comparison.component.html',
  styleUrl: './st-product-comparison.component.scss',
  providers: [StProductComparisonStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StProductComparisonComponent implements OnInit {

  data = toSignal(this.store.data$);
  isLoading = toSignal(this.store.isLoading$);
  baseUrl = this.config?.backend?.occ?.baseUrl;

  constructor(
    private router: Router,
    private config: OccConfig,
    private destroyRef: DestroyRef,
    private store: StProductComparisonStore,
    private comparisonProductService: ComparisonProductService,
    private comparisonProductsStatePersistenceService: ComparisonProductsStatePersistenceService
  ) {}

  ngOnInit(): void {
    this.comparisonProductsStatePersistenceService.initSync();
    this.comparisonProductService.getEntries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entries: string[]) => {
        if (entries.length > 0) {
          this.store.loadProductsComparison(entries.join(','));
        } else {
          this.store.clearData();
        }
      });
  }

  deleteFromComparison(code: string): void {
    this.comparisonProductService.delete(code);
  }

  navigateToProduct(url: string): void {
    this.router.navigate([url]);
  }

  containsClassification(product: Product, code: string = ''): boolean {
    let isExist = false;
    if (product.classifications) {
      product.classifications.forEach(element => {
        if (element.code === code) {
          isExist = true;
          return;
        }
      });
    }
    return isExist;
  }

  protected readonly getImage = getImage;
}
