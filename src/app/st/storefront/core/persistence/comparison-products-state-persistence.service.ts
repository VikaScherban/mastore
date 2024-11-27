import { Injectable, OnDestroy } from '@angular/core';
import {
  BASE_SITE_CONTEXT_ID,
  SiteContextParamsService,
  StatePersistenceService,
  StorageSyncType
} from '@spartacus/core';
import { Subscription } from 'rxjs';
import { ComparisonProductService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class ComparisonProductsStatePersistenceService implements OnDestroy {

  private subscription = new Subscription();
  private key = 'comparison-products';

  constructor(
    private siteContextParamsService: SiteContextParamsService,
    private statePersistenceService: StatePersistenceService,
    private comparisonProductService: ComparisonProductService
  ) { }

  initSync(): void {
    this.subscription.add(
      this.statePersistenceService.syncWithStorage({
        key: this.key,
        state$: this.comparisonProductService.getEntries(),
        context$: this.siteContextParamsService.getValues([
          BASE_SITE_CONTEXT_ID,
        ]),
        storageType: StorageSyncType.LOCAL_STORAGE,
        onRead: (state) => this.onRead(state as string[]),
      }),
    );
  }

  private onRead(entries: string[]): void {
    this.comparisonProductService.loadEntries(entries);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
