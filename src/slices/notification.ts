import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from 'src/store';
import axios from 'src/utils/axios';
import { Notification } from 'src/types/notification';

interface NotificationsState {
  notifications: Notification[];
  count: number;
}

const initialState: NotificationsState = {
  notifications: [],
  count: 0
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getNotifications(
      state: NotificationsState,
      action: PayloadAction<{ notifications: Notification[]; count: number }>
    ) {
      const { notifications, count } = action.payload;

      state.notifications = notifications;
      state.count = count;
    }
  }
});

export const reducer = slice.reducer;

export const getNotifications = (): AppThunk => async dispatch => {
  const response = await axios.get<{
    notifications: Notification[];
    count: number;
  }>('/notifications/top');
  dispatch(slice.actions.getNotifications(response.data));
};

export default slice;
