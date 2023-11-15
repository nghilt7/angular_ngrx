import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { popularTagsAction } from './actions';
import { PopularTagService } from '../services/popularTag.service';
import { PopularTagType } from '../../../types/popularTag.type';

export const getFeedUserEffect = createEffect(
  (
    action$ = inject(Actions),
    popularTagsService = inject(PopularTagService),
  ) => {
    return action$.pipe(
      ofType(popularTagsAction.getPopularTags),
      switchMap(() => {
        return popularTagsService.getPopularTags().pipe(
          map((popularTags: PopularTagType[]) => {
            return popularTagsAction.getPopularTagsSuccess({ popularTags });
          }),
          catchError(() => {
            return of(popularTagsAction.getPopularTagsFailure());
          }),
        );
      }),
    );
  },
  { functional: true },
);
