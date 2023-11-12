import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthStateInterface } from '../types/authState.interface';
import { authAction } from './actions';
import { routerNavigatedAction } from '@ngrx/router-store';
import { state } from '@angular/animations';

const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading: false,
  currentUser: undefined,
  validationErrors: null,
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    // Register
    on(authAction.register, (state) => ({
      ...state,
      isSubmitting: true,
      validationErrors: null,
    })),
    on(authAction.registerSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      validationErrors: null,
      currentUser: action.currentUser,
    })),
    on(authAction.registerFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      validationErrors: action.errors,
    })),
    // Login
    on(authAction.login, (state) => ({
      ...state,
      isSubmitting: true,
      validationErrors: null,
    })),
    on(authAction.loginSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      validationErrors: null,
      currentUser: action.currentUser,
    })),
    on(authAction.loginFailure, (state, action) => ({
      ...state,
      isSubmitting: false,
      validationErrors: action.errors,
    })),
    // Get user
    on(authAction.getCurrentUser, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(authAction.getCurrentUserSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentUser: action.currentUser,
    })),
    on(authAction.getCurrentUserFailure, (state) => ({
      ...state,
      isLoading: false,
      currentUser: null,
    })),
    // Navigate
    on(routerNavigatedAction, (state) => ({
      ...state,
      validationErrors: null,
    })),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentUser,
  selectValidationErrors,
} = authFeature;
