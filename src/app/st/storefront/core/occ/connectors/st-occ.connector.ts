import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, DynamicAttributes, OCC_USER_ID_CURRENT, OccEndpointsService, UserIdService } from '@spartacus/core';
import { combineLatest, map, Observable, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StOccConnector {

  constructor(
    private http: HttpClient,
    private occ: OccEndpointsService,
    private userIdService: UserIdService,
    private authService: AuthService
  ) {}

  get<T>(
    endpoint: string,
    urlParams?: object,
    queryParams?: object,
    options?: object,
  ): Observable<T> {
    return this.getOccUserId()
      .pipe(
        take(1),
        switchMap(userId => this.http.get<T>(
          this.getUrl(endpoint, { ...urlParams, userId }, queryParams),
          options,
        ))
      );
  }

  private getUrl(
    endpoint: string,
    urlParams?: object,
    queryParams?: object,
  ): string {
    const attributes: DynamicAttributes = { urlParams, queryParams };
    return this.occ.buildUrl(endpoint, attributes);
  }

  private getOccUserId(): Observable<string> {
    return combineLatest([
      this.authService.isUserLoggedIn(),
      this.userIdService.getUserId()
    ]).pipe(
      take(1),
      map(([isUserLoggedIn, userId]) => {
        if (isUserLoggedIn) {
          return OCC_USER_ID_CURRENT;
        }
        return userId;
      })
    );
  }
}
