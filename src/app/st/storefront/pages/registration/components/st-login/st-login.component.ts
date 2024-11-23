import { Component } from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {AuthService, useFeatureStyles, User} from "@spartacus/core";
import {UserAccountFacade} from "@spartacus/user/account/root";
import {of, switchMap} from "rxjs";

@Component({
  selector: 'st-login',
  templateUrl: './st-login.component.html',
})
export class StLoginComponent {

  user = toSignal<User | undefined>(
    this.auth.isUserLoggedIn().pipe(
      switchMap((isUserLoggedIn) => {
        if (isUserLoggedIn) {
          return this.userAccount.get();
        } else {
          return of(undefined);
        }
      })
    )
  );

  constructor(
    private auth: AuthService,
    private userAccount: UserAccountFacade
  ) {
    useFeatureStyles('a11yMyAccountLinkOutline');
  }
}
