import {ChangeDetectionStrategy, Component, OnInit, Signal, signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartConfigService } from '@spartacus/cart/base/core';
import { AuthService, RoutingService } from '@spartacus/core';
import { ActiveCartFacade, Cart, OrderEntry, PromotionLocation, SelectiveCartFacade } from '@spartacus/cart/base/root';
import { combineLatest, map, of, tap } from 'rxjs';

@Component({
  selector: 'st-wrapper-cart',
  templateUrl: './st-wrapper-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StWrapperCartComponent implements OnInit {

  selectiveCartEnabled: boolean = false;
  promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;
  readonly cart = toSignal<Cart>(this.activeCartService.getActive());
  readonly entries = toSignal<OrderEntry[]>(this.activeCartService.getEntries().pipe(
    map(entries => entries?.length ? entries : [])
  )) as Signal<OrderEntry[]>;
  readonly cartLoaded = toSignal<boolean>(
    combineLatest([
      this.activeCartService.isStable(),
      this.selectiveCartEnabled
        ? this.selectiveCartService.isStable()
        : of(false),
      this.authService.isUserLoggedIn(),
    ]).pipe(
      tap(([, , loggedIn]) => (this.loggedIn.set(loggedIn))),
      map(([cartLoaded, sflLoaded, loggedIn]) =>
        loggedIn && this.selectiveCartEnabled
          ? cartLoaded && sflLoaded
          : cartLoaded
      )
    )
  );
  loggedIn = signal<boolean>(false);

  constructor(
    protected activeCartService: ActiveCartFacade,
    protected selectiveCartService: SelectiveCartFacade,
    protected authService: AuthService,
    protected routingService: RoutingService,
    protected cartConfig: CartConfigService
  ) { }

  ngOnInit(): void {
    this.selectiveCartEnabled = this.cartConfig.isSelectiveCartEnabled();
  }

  saveForLater(item: OrderEntry) {
    if (this.loggedIn()) {
      this.activeCartService.removeEntry(item);
      this.selectiveCartService.addEntry(
        item.product?.code ?? '',
        item.quantity ?? 0
      );
    } else {
      this.routingService.go({ cxRoute: 'login' });
    }
  }
}
