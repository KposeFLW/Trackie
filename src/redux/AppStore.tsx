import React from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider, useDispatch, useSelector} from 'react-redux';

import {categoryReducer} from './reducers/CategoryReducers';
// import {testReducer} from './reducers/MangaReducers';
// import {testReducer} from './reducers/PeopleReducers';

// TODO Logger middleware

const store = configureStore({
  reducer: {
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppState = () => useSelector((state: RootState) => state);

export function withAppStore<T>(WrappedComponent: React.FC<T>) {
  const ComponentWithStore = (props: T) => {
    return (
      <Provider store={store}>
        <WrappedComponent {...(props as T)} />
      </Provider>
    );
  };

  return ComponentWithStore;
}