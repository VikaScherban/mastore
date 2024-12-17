import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActiveCartFacade, Cart, OrderEntry } from '@spartacus/cart/base/root';
import { RouterLink } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { ExportOrderEntriesToCsvService } from '@spartacus/cart/import-export/components';
import { map, take } from 'rxjs';

@Component({
  selector: 'st-cart-actions',
  standalone: true,
  templateUrl: './st-cart-actions.component.html',
  imports: [
    RouterLink,
    UrlModule,
    I18nModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCartActionsComponent {

  readonly cart = toSignal<Cart>(this.activeCartService.getActive());
  readonly entries = toSignal<OrderEntry[]>(this.activeCartService.getEntries().pipe(
    map(entries => entries?.length ? entries : [])
  ));

  @ViewChild('saveElement') saveElement!: ElementRef;
  @ViewChild('clearElement') clearElement!: ElementRef;

  constructor(
    private vcr: ViewContainerRef,
    private dr: DestroyRef,
    private activeCartService: ActiveCartFacade,
    private launchDialogService: LaunchDialogService,
    private exportEntriesService: ExportOrderEntriesToCsvService,
  ) {
  }

  saveCart(cart: Cart): void {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.SAVED_CART,
      this.saveElement,
      this.vcr,
      {cart, layoutOption: 'save'}
    );

    if (dialog) {
      dialog.pipe(take(1), takeUntilDestroyed(this.dr)).subscribe();
    }
  }

  clearCart(event: Event): void {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.CLEAR_CART,
      this.clearElement,
      this.vcr
    );
    if (dialog) {
      dialog.pipe(take(1), takeUntilDestroyed(this.dr)).subscribe();
    }
    event.stopPropagation();
  }

  exportCsv(entries: OrderEntry[]): void {
    this.exportEntriesService.downloadCsv(entries);
  }
}
