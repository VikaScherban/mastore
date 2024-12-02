import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslationService } from '@spartacus/core';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { switchMap } from 'rxjs';

@Component({
  selector: 'st-checkout-layout-header',
  standalone: true,
  template: `
    <div class="mt-2 mb-4">
      <h2 class="cx-checkout-title d-none d-lg-block d-xl-block">
        {{ title() }}
      </h2>
    </div>
    <div class="st-cart mb-4">
      <ng-content select="[st-checkout-layout-header-content]"></ng-content>
    </div>
  `,
})
export class StCheckoutLayoutHeaderComponent {

  title = toSignal<string>(
    this.checkoutStepService.activeStepIndex$
      .pipe(
        switchMap(activeStepIndex => {
          let title = '';
          switch (activeStepIndex) {
            case 0: title = 'checkoutAddress.shippingAddress'; break;
            case 1: title = 'checkoutMode.deliveryMethod'; break;
          }
          return this.translationService.translate(title);
        })
      )
  );

  constructor(
    private checkoutStepService: CheckoutStepService,
    private translationService: TranslationService
  ) {}
}
