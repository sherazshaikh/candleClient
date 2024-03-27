// reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web

import authReducer from '../features/auth/authSlice';
import utilReducer from '../features/util/utilSlice';
import sessionReducer from '../features/session/sessionslice';
import cartReducer from '../features/cart/cartslice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'baseURL', 'sessionExpired', 'cart'], // Add slice names to persist here
};


const rootReducer = combineReducers({
  auth: authReducer,
  baseURL: utilReducer,
  sessionExpired: sessionReducer,
  cart: cartReducer
  // Add other slices here
});

export default persistReducer(persistConfig, rootReducer);
