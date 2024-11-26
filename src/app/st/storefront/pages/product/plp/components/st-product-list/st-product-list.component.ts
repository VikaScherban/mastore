import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { GlobalMessageService, GlobalMessageType, ProductSearchPage, useFeatureStyles } from '@spartacus/core';
import { PageLayoutService, ProductListComponentService, ViewConfig, ViewModes } from '@spartacus/storefront';
import { BehaviorSubject, combineLatest, filter, skip, take } from 'rxjs';

@Component({
  selector: 'st-product-list',
  templateUrl: './st-product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StProductListComponent implements OnInit {

  private viewMode$ = new BehaviorSubject<ViewModes>(ViewModes.Grid);
  isInfiniteScroll: boolean | undefined;

  model = toSignal<ProductSearchPage>(this.productListComponentService.model$);
  viewMode = toSignal<ViewModes>(this.viewMode$);
  ViewModes = ViewModes;

  constructor(
    private dr: DestroyRef,
    private pageLayoutService: PageLayoutService,
    private productListComponentService: ProductListComponentService,
    private globalMessageService: GlobalMessageService,
    public scrollConfig: ViewConfig
  ) {
    useFeatureStyles('a11ySortingOptionsTruncation');
    useFeatureStyles('a11yTruncatedTextForResponsiveView');
  }

  ngOnInit(): void {
    this.isInfiniteScroll = this.scrollConfig.view?.infiniteScroll?.active;

    this.pageLayoutService.templateName$
      .pipe(
        take(1),
        takeUntilDestroyed(this.dr)
        )
      .subscribe((template) => {
        this.viewMode$.next(
          template === 'ProductGridPageTemplate'
            ? ViewModes.Grid
            : ViewModes.List
        );
      });

    combineLatest([this.productListComponentService.model$, this.viewMode$])
      .pipe(
        skip(1),
        filter(([model, mode]) => !!model && !!mode),
        takeUntilDestroyed(this.dr)
      )
      .subscribe(() =>
        this.globalMessageService.add(
          { key: 'sorting.pageViewUpdated' },
          GlobalMessageType.MSG_TYPE_ASSISTIVE,
          500
        )
      );
  }

  sortList(sortCode: string): void {
    this.productListComponentService.sort(sortCode);
  }

  setViewMode(mode: ViewModes): void {
    this.viewMode$.next(mode);
  }
}
