import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  ActiveCartFacade,
  CartItemComponentOptions,
  CartOutlets,
  ConsignmentEntry,
  MultiCartFacade,
  OrderEntry,
  PromotionLocation,
  SelectiveCartFacade
} from '@spartacus/cart/base/root';
import { FeatureConfigService, useFeatureStyles, UserIdService } from '@spartacus/core';
import { OutletContextData } from '@spartacus/storefront';
import { map, Observable, startWith, Subscription, tap } from 'rxjs';

interface ItemListContext {
  readonly?: boolean;
  hasHeader?: boolean;
  options?: CartItemComponentOptions;
  cartId?: string;
  items?: OrderEntry[];
  promotionLocation?: PromotionLocation;
  cartIsLoading?: boolean;
}

@Component({
  selector: 'st-cart-item-list',
  templateUrl: './st-cart-item-list.component.html',
})
export class StCartItemListComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();
  protected userId!: string;

  @Input() readonly: boolean = false;

  @Input() hasHeader: boolean = true;

  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null,
    displayAddToCart: false,
  };

  @Input() cartId!: string;

  protected _items: OrderEntry[] = [];
  form: UntypedFormGroup = new UntypedFormGroup({});

  @Input('items')
  set items(items: OrderEntry[]) {
    this._setItems(items);
  }
  get items(): OrderEntry[] {
    return this._items;
  }

  @Input() promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  @Input('cartIsLoading') set setLoading(value: boolean) {
    if (!this.readonly) {
      value
        ? this.form.disable({ emitEvent: false })
        : this.form.enable({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  readonly CartOutlets = CartOutlets;
  private featureConfigService = inject(FeatureConfigService);

  constructor(
    protected activeCartService: ActiveCartFacade,
    protected selectiveCartService: SelectiveCartFacade,
    protected userIdService: UserIdService,
    protected multiCartService: MultiCartFacade,
    protected cd: ChangeDetectorRef,
    @Optional() protected outlet?: OutletContextData<ItemListContext>
  ) {
    useFeatureStyles('a11yPreventHorizontalScroll');
  }

  ngOnInit(): void {
    this.subscription.add(this.getInputsFromContext());

    this.subscription.add(
      this.userIdService
        ?.getUserId()
        .subscribe((userId) => (this.userId = userId))
    );
  }

  getQuantityControl(control: UntypedFormGroup): UntypedFormControl {
    return control.get('quantity') as UntypedFormControl;
  }

  private _setItems(
    items: OrderEntry[],
    options?: { forceRerender?: boolean }
  ) {
    this.resolveItems(items, options);
    this.createForm();
  }

  private getInputsFromContext(): Subscription | undefined {
    return this.outlet?.context$.subscribe((context) => {
      let contextRequiresRerender = false;
      if (context.readonly !== undefined) {
        contextRequiresRerender = this.readonly !== context.readonly;
        this.readonly = context.readonly;
      }
      if (context.hasHeader !== undefined) {
        this.hasHeader = context.hasHeader;
      }
      if (context.options !== undefined) {
        this.options = context.options;
      }
      if (context.cartId !== undefined) {
        this.cartId = context.cartId;
      }
      if (context.promotionLocation !== undefined) {
        this.promotionLocation = context.promotionLocation;
      }
      if (context.cartIsLoading !== undefined) {
        this.setLoading = context.cartIsLoading;
      }
      this.updateItemsOnContextChange(context, contextRequiresRerender);
    });
  }

  private updateItemsOnContextChange(
    context: ItemListContext,
    contextRequiresRerender: boolean
  ) {
    const preventRedundantRecreationEnabled =
      this.featureConfigService.isEnabled(
        'a11yPreventCartItemsFormRedundantRecreation'
      );
    if (
      context.items !== undefined &&
      (!preventRedundantRecreationEnabled ||
        contextRequiresRerender ||
        this.isItemsChanged(context.items))
    ) {
      this.cd.markForCheck();
      this._setItems(context.items, {
        forceRerender: contextRequiresRerender,
      });
    }
  }

  private isItemsChanged(newItems: OrderEntry[]): boolean {
    return JSON.stringify(this.items) !== JSON.stringify(newItems);
  }

  private resolveItems(
    items: OrderEntry[],
    options?: { forceRerender?: boolean }
  ): void {
    if (!items) {
      this._items = [];
      return;
    }

    console.log('items', items);
    if (items?.every((item) => item.hasOwnProperty('orderEntry'))) {
      this.normalizeConsignmentEntries(items);
    } else {
      this.rerenderChangedItems(items, options);
    }
  }

  private normalizeConsignmentEntries(items: OrderEntry[]) {
    this._items = items.map((consignmentEntry) => {
      const entry = Object.assign(
        {},
        (consignmentEntry as ConsignmentEntry).orderEntry
      );
      entry.quantity = consignmentEntry.quantity;
      return entry;
    });
  }

  private rerenderChangedItems(
    items: OrderEntry[],
    options?: { forceRerender?: boolean }
  ) {
    let offset = 0;
    for (
      let i = 0;
      i - offset < Math.max(items.length, this._items.length);
      i++
    ) {
      const index = i - offset;
      if (
        options?.forceRerender ||
        JSON.stringify(this._items?.[index]) !== JSON.stringify(items[index])
      ) {
        if (this._items[index]) {
          this.form?.removeControl(this.getControlName(this._items[index]));
        }
        if (!items[index]) {
          this._items.splice(index, 1);
          offset++;
        } else {
          this._items[index] = items[index];
        }
      }
    }
  }

  private createForm(): void {
    this._items.forEach((item) => {
      const controlName = this.getControlName(item);
      const control = this.form.get(controlName);
      if (control) {
        if (control.get('quantity')?.value !== item.quantity) {
          control.patchValue({ quantity: item.quantity }, { emitEvent: false });
        }
      } else {
        const group = new UntypedFormGroup({
          entryNumber: new UntypedFormControl(item.entryNumber),
          quantity: new UntypedFormControl(item.quantity, { updateOn: 'blur' }),
        });
        this.form.addControl(controlName, group);
      }
      if (!item.updateable || this.readonly) {
        this.form.controls[controlName].disable();
      }
    });
  }

  private getControlName(item: OrderEntry): string {
    return item.entryNumber?.toString() || '';
  }

  removeEntry(item: OrderEntry): void {
    if (this.options.isSaveForLater) {
      this.selectiveCartService.removeEntry(item);
    } else if (this.cartId && this.userId) {
      this.multiCartService.removeEntry(
        this.userId,
        this.cartId,
        item.entryNumber as number
      );
    } else {
      this.activeCartService.removeEntry(item);
    }
    delete this.form.controls[this.getControlName(item)];
  }

  getControl(item: OrderEntry): Observable<UntypedFormGroup> | undefined {
    return this.form.get(this.getControlName(item))?.valueChanges.pipe(
      // eslint-disable-next-line import/no-deprecated
      startWith(null),
      tap((value) => {
        if (item.updateable && value && !this.readonly) {
          if (this.options.isSaveForLater) {
            this.selectiveCartService.updateEntry(
              value.entryNumber,
              value.quantity
            );
          } else if (this.cartId && this.userId) {
            this.multiCartService.updateEntry(
              this.userId,
              this.cartId,
              value.entryNumber,
              value.quantity
            );
          } else {
            this.activeCartService.updateEntry(
              value.entryNumber,
              value.quantity
            );
          }
        }
      }),
      map(() => <UntypedFormGroup>this.form.get(this.getControlName(item)))
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
