import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-cart-totals',
  templateUrl: './st-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCartTotalsComponent {
  readonly cart = toSignal<Cart>(this.activeCartService.getActive());

  constructor(private activeCartService: ActiveCartFacade) {}
}
