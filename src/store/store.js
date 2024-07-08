import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import showClientReducer from './features/About/showClientSlice'
import tokenReducer from './features/Health/tokenSlice';

const rootReducer = combineReducers({
  clientDetails: showClientReducer,
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
