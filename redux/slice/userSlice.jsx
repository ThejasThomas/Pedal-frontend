import { createSlice } from "@reduxjs/toolkit";
const loadInitialState = () => {
  try {
    const userData = localStorage.getItem('userData');
    const isAuth = localStorage.getItem('isAuthenticated');
    return {
      isAuthenticated: isAuth === 'true',
      users: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return {
      isAuthenticated: false,
      users: null,
    };
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: loadInitialState(),
  reducers: {
    addUser: (state, action) => {
      state.users = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('userData', JSON.stringify(action.payload));
      localStorage.setItem('isAuthenticated', 'true');
    },
    logoutUser: (state) => {
      state.users = null;
      state.isAuthenticated = false;

      localStorage.removeItem('userData');
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { addUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;