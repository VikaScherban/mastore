import {ChangeDetectionStrategy, Component, inject, OnInit, Optional} from '@angular/core';
import {
  RoutingService
} from "@spartacus/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'st-returning-customer-register',
  templateUrl: './st-returning-customer-register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StReturningCustomerRegisterComponent implements OnInit {

  loginAsGuest = false;

  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.loginAsGuest = this.activatedRoute.snapshot.queryParams['forced'];
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
