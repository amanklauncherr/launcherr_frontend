import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import tokenReducer from './features/tokenSlice';

const rootReducer = combineReducers({
  token: tokenReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
