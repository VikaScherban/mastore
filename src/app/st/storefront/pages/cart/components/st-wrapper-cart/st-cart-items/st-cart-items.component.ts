import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit, Optional } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  ActiveCartFacade,
  CartItemComponentOptions,
  CartOutlets, ConsignmentEntry, MultiCartFacade,
  OrderEntry,
  PromotionLocation, SelectiveCartFacade
} from '@spartacus/cart/base/root';
import { FeatureConfigService, I18nModule, useFeatureStyles, UserIdService } from '@spartacus/core';
import { OutletContextData, OutletModule } from '@spartacus/storefront';
import { map, Observable, startWith, tap } from 'rxjs';
import { StCartItemListRowComponent } from '../st-cart-item-list-row/st-cart-item-list-row.component';

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
  selector: 'st-cart-items',
  standalone: true,
  templateUrl: './st-cart-items.component.html',
  imports: [
    I18nModule,
    OutletModule,
    AsyncPipe,
    StCartItemListRowComponent
  ]
})
export class StCartItemsComponent implements OnInit {

  private featureConfigService = inject(FeatureConfigService);
  readonly userId = toSignal<string | undefined>(this.userIdService.getUserId());
  readonly CartOutlets = CartOutlets;
  form: UntypedFormGroup = new UntypedFormGroup({});
  private _items: OrderEntry[] = [];

  @Input() cartId?: string;
  @Input() readonly: boolean = false;
  @Input() hasHeader: boolean = true;
  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null,
    displayAddToCart: false,
  };
  @Input('cartIsLoading') set setLoading(value: boolean) {
    if (!this.readonly) {
      value
        ? this.form.disable({ emitEvent: false })
        : this.form.enable({ emitEvent: false });
      this.cd.markForCheck();
    }
  }
  @Input('items')
  set items(items: OrderEntry[]) {
    this._setItems(items);
  }
  get items(): OrderEntry[] {
    return this._items;
  }
  @Input() promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  constructor(
    protected activeCartService: ActiveCartFacade,
    protected selectiveCartService: SelectiveCartFacade,
    protected userIdService: UserIdService,
    protected multiCartService: MultiCartFacade,
    protected cd: ChangeDetectorRef,
    protected dr: DestroyRef,
    @Optional() protected outlet?: OutletContextData<ItemListContext>
  ) {
    useFeatureStyles('a11yPreventHorizontalScroll');
  }

  ngOnInit(): void {
    this.inputsFromContext();
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
              this.userId() as string,
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
      map(() => <UntypedFormGroup>this.form.get(this.getControlName(item))),
      takeUntilDestroyed(this.dr)
    );
  }

  getQuantityControl(control: UntypedFormGroup): UntypedFormControl {
    return control.get('quantity') as UntypedFormControl;
  }

  private inputsFromContext(): void {
    this.outlet?.context$.subscribe((context) => {
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

  private _setItems(
    items: OrderEntry[],
    options?: { forceRerender?: boolean }
  ) {
    this.resolveItems(items, options);
    this.createForm();
  }

  private isItemsChanged(newItems: OrderEntry[]): boolean {
    return JSON.stringify(this.items) !== JSON.stringify(newItems);
  }

  private resolveItems(
    items: OrderEntry[],
    options?: { forceRerender?: boolean }
  ): void {
    if (!items) {
      this.items = [];
      return;
    }
    if (items.every((item) => item.hasOwnProperty('orderEntry'))) {
      this.normalizeConsignmentEntries(items);
    } else {
      this.rerenderChangedItems(items, options);
    }
  }

  private normalizeConsignmentEntries(items: OrderEntry[]) {
    this.items = items.map((consignmentEntry) => {
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
    if (this.items) {
      let offset = 0;
      for (
        let i = 0;
        i - offset < Math.max(items.length, this.items?.length);
        i++
      ) {
        const index = i - offset;
        if (
          options?.forceRerender ||
          JSON.stringify(this.items?.[index]) !== JSON.stringify(items[index])
        ) {
          if (this.items[index]) {
            this.form?.removeControl(this.getControlName(this.items[index]));
          }
          if (!items[index]) {
            this.items.splice(index, 1);
            offset++;
          } else {
            this.items[index] = items[index];
          }
        }
      }
    }
  }

  private getControlName(item: OrderEntry): string {
    return item.entryNumber?.toString() || '';
  }

  private createForm(): void {
    if (this.items) {
      this.items.forEach((item) => {
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
  }
}
