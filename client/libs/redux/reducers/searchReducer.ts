import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

type initialStateType = {
  keySync: string;
  keyAsync: string;
};

const initialState: initialStateType = {
  keySync: '',
  keyAsync: '',
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setKeySync: (state, { payload }) => {
      state.keySync = payload.key;
    },
    setKeyASync: (state, { payload }) => {
      state.keyAsync = payload.key;
    },
    clearSearch: () => initialState,
  },
});

export const { setKeySync, setKeyASync, clearSearch } = searchSlice.actions;

export const selectKeyAsync = (state: AppState) => state.search.keySync;
export const selectKeySync = (state: AppState) => state.search.keyAsync;

export default searchSlice.reducer;
