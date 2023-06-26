import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: string ;
  password: string ;
}

const initialState: UserState = {
  user: '',
  password: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<UserState>) => {
      state.user = action.payload.user;
      state.password = action.payload.password;
    },
    clearUser: (state) => {
      state.user = '';
      state.password = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;