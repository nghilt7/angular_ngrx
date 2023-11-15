import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { PersistenceService } from '../../../services/persistence.service';
import { authAction } from '../../../../auth/store/actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { CurrentUserInterface } from '../../../types/currentUser.interface';
import { FeedService } from '../services/feed.service';
import { feedActions } from './actions';
import { GetFeedResponseInterface } from '../types/getFeedResponse.interface';

export const getFeedUserEffect = createEffect(
  (action$ = inject(Actions), feedService = inject(FeedService)) => {
    return action$.pipe(
      ofType(feedActions.getFeed),
      switchMap(({ url }) => {
        return feedService.getFeed(url).pipe(
          map((feed: GetFeedResponseInterface) => {
            return feedActions.getFeedSuccess({ feed });
          }),
          catchError(() => {
            return of(feedActions.getFeedFailure());
          }),
        );
      }),
    );
  },
  { functional: true },
);
