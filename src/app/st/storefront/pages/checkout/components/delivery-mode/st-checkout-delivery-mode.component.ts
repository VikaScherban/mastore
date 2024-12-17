import { ChangeDetectionStrategy, Component, inject, Optional, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckoutConfigService, CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutDeliveryModesFacade } from '@spartacus/checkout/base/root';
import { ActiveCartFacade, Cart, CartOutlets, DeliveryMode, OrderEntry } from '@spartacus/cart/base/root';
import { FeatureConfigService, GlobalMessageService, GlobalMessageType } from '@spartacus/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'st-checkout-delivery-mode',
  templateUrl: './st-checkout-delivery-mode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StCheckoutDeliveryModeComponent {

  private busy$ = new BehaviorSubject(false);
  private selectedDeliveryModeCode$ = this.checkoutDeliveryModesFacade
    .getSelectedDeliveryModeState()
    .pipe(
      filter((state) => !state.loading),
      map((state) => state.data),
      map((deliveryMode) => deliveryMode?.code)
    );

  protected readonly CartOutlets = CartOutlets;

  @Optional() featureConfigService = inject(FeatureConfigService, {
    optional: true,
  });

  isUpdating = toSignal<boolean>(
    combineLatest([
      this.busy$,
      this.checkoutDeliveryModesFacade
        .getSelectedDeliveryModeState()
        .pipe(map((state) => state.loading)),
    ]).pipe(
      map(([busy, loading]) => busy || loading),
      distinctUntilChanged()
    )
  );
  supportedDeliveryModes = toSignal<DeliveryMode[]>(
    this.checkoutDeliveryModesFacade
      .getSupportedDeliveryModes()
      .pipe(
        filter((deliveryModes) => !!deliveryModes?.length),
        withLatestFrom(this.selectedDeliveryModeCode$),
        tap(([deliveryModes, code]) => {
          if (
            !code ||
            !deliveryModes.find((deliveryMode) => deliveryMode.code === code)
          ) {
            code =
              this.checkoutConfigService.getPreferredDeliveryMode(deliveryModes);
          }
          if (code) {
            this.mode.controls['deliveryModeId'].setValue(code);
            this.changeMode(code);
          }
        }),
        map(([deliveryModes]) =>
          deliveryModes.filter((mode) => mode.code !== 'pickup')
        )
      )
  );
  cart = toSignal<Cart>(this.activeCartFacade.getActive());
  hasPickupItems = toSignal<boolean>(this.activeCartFacade.hasPickupItems());
  deliveryEntries = toSignal<OrderEntry[]>(this.activeCartFacade.getDeliveryEntries());
  isSetDeliveryModeHttpError = signal<boolean>(false);

  mode: UntypedFormGroup = this.fb.group({
    deliveryModeId: ['', Validators.required],
  });

  backBtnText = this.checkoutStepService.getBackBntText(this.activatedRoute);

  get deliveryModeInvalid(): boolean {
    return this.mode.controls['deliveryModeId'].invalid;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private checkoutConfigService: CheckoutConfigService,
    private activatedRoute: ActivatedRoute,
    private checkoutStepService: CheckoutStepService,
    private checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    private activeCartFacade: ActiveCartFacade,
    private globalMessageService: GlobalMessageService
  ) {}

  changeMode(code: string | undefined, event?: Event): void {
    if (!code) {
      return;
    }
    const lastFocusedId = (<HTMLElement>event?.target)?.id;
    this.busy$.next(true);
    this.checkoutDeliveryModesFacade.setDeliveryMode(code).subscribe({
      complete: () => this.onSuccess(),
      error: () => this.onError(),
    });

    if (this.featureConfigService?.isEnabled('a11yCheckoutDeliveryFocus')) {
      const isTriggeredByKeyboard = (<MouseEvent>event)?.screenX === 0;
      if (isTriggeredByKeyboard) {
        this.restoreFocus(lastFocusedId, code);
        return;
      }
      this.mode.setValue({ deliveryModeId: code });
    }
  }

  next(): void {
    this.checkoutStepService.next(this.activatedRoute);
  }

  back(): void {
    this.checkoutStepService.back(this.activatedRoute);
  }

  getAriaChecked(code: string | undefined): boolean {
    return code === this.mode.controls['deliveryModeId'].value;
  }

  private onSuccess(): void {
    this.isSetDeliveryModeHttpError.set(false);
    this.busy$.next(false);
  }

  private onError(): void {
    this.globalMessageService?.add(
      { key: 'setDeliveryMode.unknownError' },
      GlobalMessageType.MSG_TYPE_ERROR
    );

    this.isSetDeliveryModeHttpError.set(true);
    this.busy$.next(false);
  }

  private restoreFocus(lastFocusedId: string, code: string): void {
    if (!this.isUpdating()) {
      setTimeout(() => {
        document.querySelector('main')?.classList.remove('mouse-focus');
        this.mode.setValue({ deliveryModeId: code });
        document.getElementById(lastFocusedId)?.focus();
      }, 0);
    }
  }
}
