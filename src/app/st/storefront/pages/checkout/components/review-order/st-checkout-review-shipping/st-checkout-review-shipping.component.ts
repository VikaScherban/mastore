import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Address, FeatureConfigService, TranslationService } from '@spartacus/core';
import {ActiveCartFacade, CartOutlets, DeliveryMode, OrderEntry} from '@spartacus/cart/base/root';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade,
  CheckoutStepType
} from '@spartacus/checkout/base/root';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { deliveryAddressCard, deliveryModeCard } from '@spartacus/order/root';
import { combineLatest, filter, map, Observable } from 'rxjs';

@Component({
  selector: 'st-checkout-review-shipping',
  templateUrl: './st-checkout-review-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCheckoutReviewShippingComponent {

  private featureConfig = inject(FeatureConfigService);
  private showDeliveryOptionsTranslation = this.featureConfig.isEnabled(
    'showDeliveryOptionsTranslation'
  );

  readonly cartOutlets = CartOutlets;
  iconTypes = ICON_TYPE;

  deliveryAddressStepRoute = this.checkoutStepService.getCheckoutStepRoute(
    CheckoutStepType.DELIVERY_ADDRESS
  );
  deliveryModeStepRoute = this.checkoutStepService.getCheckoutStepRoute(
    CheckoutStepType.DELIVERY_MODE
  );

  entries = toSignal<OrderEntry[]>( this.activeCartFacade.getDeliveryEntries());
  deliveryAddress = toSignal<Address | undefined>(
    this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    )
  );
  deliveryMode = toSignal<DeliveryMode | undefined>(
    this.checkoutDeliveryModesFacade.getSelectedDeliveryModeState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    )
  );

  constructor(
    private activeCartFacade: ActiveCartFacade,
    private checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    private checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    private translationService: TranslationService,
    private checkoutStepService: CheckoutStepService
  ) {}

  getDeliveryAddressCard(
    deliveryAddress: Address = {},
    countryName?: string
  ): Observable<Card> {
    return combineLatest([
      this.translationService.translate('addressCard.shipTo'),
      this.translationService.translate('addressCard.phoneNumber'),
      this.translationService.translate('addressCard.mobileNumber'),
    ]).pipe(
      map(([textTitle, textPhone, textMobile]) =>
        deliveryAddressCard(
          textTitle,
          textPhone,
          textMobile,
          deliveryAddress,
          countryName
        )
      )
    );
  }

  getDeliveryModeCard(deliveryMode: DeliveryMode = {}): Observable<Card> {
    return combineLatest([
      this.translationService.translate(
        this.showDeliveryOptionsTranslation
          ? 'checkoutMode.deliveryOptions'
          : 'checkoutMode.deliveryMethod'
      ),
    ]).pipe(map(([textTitle]) => deliveryModeCard(textTitle, deliveryMode)));
  }
}
