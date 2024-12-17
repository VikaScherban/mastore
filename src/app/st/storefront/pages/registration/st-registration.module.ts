import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, UntypedFormBuilder} from "@angular/forms";
import { RouterLink } from "@angular/router";
import {
  AuthService,
  FeaturesConfigModule, GlobalMessageService,
  I18nModule,
  NotAuthGuard,
  provideDefaultConfig,
  UrlModule, WindowRef
} from "@spartacus/core";
import {
  FormErrorsModule,
  NgSelectA11yModule,
  PageSlotModule,
  PasswordVisibilityToggleModule,
  SpinnerModule
} from "@spartacus/storefront";
import { LoginFormComponentService } from "@spartacus/user/account/components";
import { RegisterComponentService } from "@spartacus/user/profile/components";
import { UserRegisterFacade } from "@spartacus/user/profile/root";

import { StReturningCustomerRegisterComponent } from './components/st-returning-customer-register/st-returning-customer-register.component';
import { StReturningCustomerLoginComponent } from './components/st-returning-customer-login/st-returning-customer-login.component';
import { StLoginComponent } from './components/st-login/st-login.component';
import { StRegisterComponent } from './components/st-register/st-register.component';
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [
    StReturningCustomerLoginComponent,
    StReturningCustomerRegisterComponent,
    StLoginComponent,
    StRegisterComponent
  ],
  imports: [
    CommonModule,
    SpinnerModule,
    ReactiveFormsModule,
    I18nModule,
    FormErrorsModule,
    RouterLink,
    UrlModule,
    FeaturesConfigModule,
    PageSlotModule,
    NgSelectModule,
    NgSelectA11yModule,
    PasswordVisibilityToggleModule
  ],
  providers: [
    provideDefaultConfig({
      cmsComponents: {
        ReturningCustomerLoginComponent: {
          component: StReturningCustomerLoginComponent,
          guards: [NotAuthGuard],
          providers: [
            {
              provide: LoginFormComponentService,
              useClass: LoginFormComponentService,
              deps: [AuthService, GlobalMessageService, WindowRef],
            },
          ],
        },
        ReturningCustomerRegisterComponent: {
          component: StReturningCustomerRegisterComponent,
          guards: [NotAuthGuard],
        },
        LoginComponent: {
          component: StLoginComponent,
        },
        RegisterCustomerComponent: {
          component: StRegisterComponent,
          guards: [NotAuthGuard],
          providers: [
            {
              provide: RegisterComponentService,
              useClass: RegisterComponentService,
              deps: [
                UserRegisterFacade,
                GlobalMessageService,
                UntypedFormBuilder,
              ],
            },
          ],
        },
      },
    }),
  ],
})
export class StRegistrationModule { }
