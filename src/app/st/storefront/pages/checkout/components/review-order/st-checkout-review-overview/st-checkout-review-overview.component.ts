import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';

@Component({
  selector: 'st-checkout-review-overview',
  templateUrl: './st-checkout-review-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCheckoutReviewOverviewComponent {

  cart = toSignal<Cart>(this.activeCartFacade.getActive());

  constructor(private activeCartFacade: ActiveCartFacade) {}
}
