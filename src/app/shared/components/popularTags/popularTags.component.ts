import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { popularTagsAction } from './store/actions';
import { combineLatest } from 'rxjs';
import {
  selectError,
  selectIsLoading,
  selectPopularTagsData,
} from './store/reducers';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { ErrorMessageComponent } from '../errorMessage/errorMessage.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mc-popular-tags',
  templateUrl: './popularTags.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    LoadingComponent,
    ErrorMessageComponent,
    RouterLink,
  ],
})
export class PopularTagsComponent implements OnInit {
  data$ = combineLatest({
    popularTags: this.store.select(selectPopularTagsData),
    isLoading: this.store.select(selectIsLoading),
    error: this.store.select(selectError),
  });

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(popularTagsAction.getPopularTags());
  }
}
