import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import { CheckoutPaymentFacade, CheckoutStepType } from '@spartacus/checkout/base/root';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { PaymentDetails, TranslationService } from '@spartacus/core';
import { billingAddressCard, paymentMethodCard } from '@spartacus/order/root';
import { combineLatest, filter, map, Observable } from 'rxjs';

@Component({
  selector: 'st-checkout-review-payment',
  templateUrl: './st-checkout-review-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCheckoutReviewPaymentComponent {

  iconTypes = ICON_TYPE;

  paymentDetailsStepRoute = this.checkoutStepService.getCheckoutStepRoute(
    CheckoutStepType.PAYMENT_DETAILS
  );

  paymentDetails = toSignal<PaymentDetails | undefined>(
    this.checkoutPaymentFacade.getPaymentDetailsState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    )
  );

  constructor(
    private checkoutStepService: CheckoutStepService,
    private checkoutPaymentFacade: CheckoutPaymentFacade,
    private translationService: TranslationService
  ) {}

  getPaymentMethodCard(paymentDetails: PaymentDetails = {}): Observable<Card> {
    return combineLatest([
      this.translationService.translate('paymentForm.payment'),
      this.translationService.translate('paymentCard.expires', {
        month: paymentDetails.expiryMonth,
        year: paymentDetails.expiryYear,
      }),
    ]).pipe(
      map(([textTitle, textExpires]) =>
        paymentMethodCard(textTitle, textExpires, paymentDetails)
      )
    );
  }

  getBillingAddressCard(paymentDetails: PaymentDetails = {}): Observable<Card> {
    return combineLatest([
      this.translationService.translate('paymentForm.billingAddress'),
      this.translationService.translate('addressCard.billTo'),
    ]).pipe(
      map(([billingAddress, billTo]) =>
        billingAddressCard(billingAddress, billTo, paymentDetails)
      )
    );
  }
}
