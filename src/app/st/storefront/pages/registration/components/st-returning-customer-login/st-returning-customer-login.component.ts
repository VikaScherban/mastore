import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import {UntypedFormGroup} from "@angular/forms";
import {toSignal} from "@angular/core/rxjs-interop";
import {LoginFormComponentService} from "@spartacus/user/account/components";

@Component({
  selector: 'st-returning-customer-login',
  templateUrl: './st-returning-customer-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StReturningCustomerLoginComponent {

  form: UntypedFormGroup = this.service.form;
  readonly isUpdating = toSignal<boolean>(this.service.isUpdating$);

  @HostBinding('class.user-form') style = true;

  constructor(protected service: LoginFormComponentService) {}

  onSubmit(): void {
    this.service.login();
  }
}
