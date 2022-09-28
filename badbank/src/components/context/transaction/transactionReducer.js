import {
  TRANS_FILTER_BY_ACCOUNT,
  CLEAR_FILTER,
  TRANS_FILTER_BY_TYPE,
  TRANS_FILTER_BY_YOU,
  GET_TRANSACTIONS,
} from '../types';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case TRANS_FILTER_BY_ACCOUNT:
    case TRANS_FILTER_BY_YOU:
    case TRANS_FILTER_BY_TYPE:
      return { ...state, filtered: action.payload };
    case CLEAR_FILTER:
      return { ...state, filtered: state.transactions };
    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload.transactions,
        filtered: action.payload.transactions,
      };
    default:
      return state;
  }
};
