import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { authAction } from './actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CurrentUserInterface } from '../../shared/types/currentUser.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PersistenceService } from '../../shared/services/persistence.service';
import { Router } from '@angular/router';

export const getCurrentUserEffect = createEffect(
  (
    action$ = inject(Actions),
    authService = inject(AuthService),
    persistenceService = inject(PersistenceService),
  ) => {
    return action$.pipe(
      ofType(authAction.getCurrentUser),
      switchMap(() => {
        const token = persistenceService.get('accessToken');
        if (!token) {
          return of(authAction.getCurrentUserFailure());
        }
        return authService.getCurrentUser().pipe(
          map((currentUser: CurrentUserInterface) => {
            return authAction.getCurrentUserSuccess({ currentUser });
          }),
          catchError(() => {
            return of(authAction.getCurrentUserFailure());
          }),
        );
      }),
    );
  },
  { functional: true },
);
export const registerEffect = createEffect(
  (
    action$ = inject(Actions),
    authService = inject(AuthService),
    persistenceService = inject(PersistenceService),
  ) => {
    return action$.pipe(
      ofType(authAction.register),
      switchMap(({ request }) => {
        return authService.register(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            persistenceService.set('accessToken', currentUser.token);
            return authAction.registerSuccess({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              authAction.registerFailure({
                errors: errorResponse.error.errors,
              }),
            );
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const redirectAfterRegisterEffect = createEffect(
  (action$ = inject(Actions), router = inject(Router)) => {
    return action$.pipe(
      ofType(authAction.registerSuccess),
      tap(() => {
        router.navigateByUrl('/');
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const loginEffect = createEffect(
  (
    action$ = inject(Actions),
    authService = inject(AuthService),
    persistenceService = inject(PersistenceService),
  ) => {
    return action$.pipe(
      ofType(authAction.login),
      switchMap(({ request }) => {
        return authService.login(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            persistenceService.set('accessToken', currentUser.token);
            return authAction.loginSuccess({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              authAction.loginFailure({
                errors: errorResponse.error.errors,
              }),
            );
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const redirectAfterLoginEffect = createEffect(
  (action$ = inject(Actions), router = inject(Router)) => {
    return action$.pipe(
      ofType(authAction.loginSuccess),
      tap(() => {
        router.navigateByUrl('/');
      }),
    );
  },
  { functional: true, dispatch: false },
);
