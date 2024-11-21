import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookings: [],
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    set(state, action) {
      state.bookings = action.payload.bookings;
    },
    update(state, action) {
      state.bookings = state.bookings.push(action.payload.booking);
    },
    delete(state, action) {
      state.bookings = state.bookings.filter(
        (el) => el._id !== action.payload.id
      );
    },
  },
});

export const bookingsAction = bookingSlice.actions;

export default bookingSlice;
