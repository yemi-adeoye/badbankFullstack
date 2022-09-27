import { SET_ALERT, REMOVE_ALERT } from '../types.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      const otherAlerts = state.filter((item) => {
        return item.id !== action.payload;
      });
      state = otherAlerts;
      return state;
    default:
      return state;
  }
};
