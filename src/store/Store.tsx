import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../components/AuthSlice/AuthSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
