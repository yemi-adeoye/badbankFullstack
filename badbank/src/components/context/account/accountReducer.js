import {
  FILTER_ACCOUNT_WITHDRAW,
  FILTER_ACCOUNT_TRANSFER_FROM,
  FILTER_ACCOUNT_TRANSFER_TO,
  SET_ACTION,
  CLEAR_FILTER,
  CLEAR_FILTER_TO,
  CLEAR_FILTER_FROM,
  GET_ACCOUNTS,
  DEPOSIT_SUCCESS,
  DEPOSIT_ERROR,
  TRANSFER_ERROR,
  TRANSFER_SUCCESS,
  CLEAR_ERRORS,
  LOADING,
  GET_ACCOUNTS_FAIL,
  ADD_ACCOUNT_FAIL,
  ADD_ACCOUNT_SUCCESS,
} from '../types.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  switch (action.type) {
    case FILTER_ACCOUNT_WITHDRAW:
      return {
        ...state,

        withDrawFilteredAccounts: action.payload,
        showOtherAccounts: true,
      };
    case TRANSFER_SUCCESS:
    case DEPOSIT_SUCCESS: {
      return {
        ...state,
        msg: action.payload,
        error: '',
        loading: false,
      };
    }
    case ADD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        msg: action.payload,
        error: '',
        loading: false,
      };
    }
    case ADD_ACCOUNT_FAIL: {
      return {
        ...state,
        error: action.payload,
        msg: '',
        loading: false,
      };
    }
    case TRANSFER_ERROR:
    case DEPOSIT_ERROR: {
      return {
        ...state,
        error: action.payload,
        msg: '',
        loading: false,
      };
    }
    case GET_ACCOUNTS:
      console.log('GETTING ACCOUNTS');
      return {
        ...state,
        accounts: action.payload,
        withDrawFilteredAccounts: action.payload,
        transferFromFilteredAccounts: action.payload,
        transferToFilteredAccounts: action.payload,
        loading: false,
        error: '',
      };
    case GET_ACCOUNTS_FAIL:
      return {
        ...state,
        accounts: [],
        withDrawFilteredAccounts: [],
        transferFromFilteredAccounts: [],
        transferToFilteredAccounts: [],
        error: "Couldn't load accounts please refresh your browser",
        loading: false,
      };
    case FILTER_ACCOUNT_TRANSFER_FROM:
      return {
        ...state,
        transferFromFilteredAccounts: action.payload.fromAcc,
        transferToFilteredAccounts: action.payload.toAcc,
        accountNumberFrom: action.payload.fromAcc[0].accountNumber,
        showOtherAccountsFrom: true,
      };
    case FILTER_ACCOUNT_TRANSFER_TO:
      console.log('to');
      return {
        ...state,
        transferToFilteredAccounts: action.payload,
        showOtherAccountsTo: true,
      };
    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_ACTION:
      return { ...state, action: action.payload };

    case CLEAR_FILTER:
      return {
        ...state,
        [action.payload]: state.accounts,
        showOtherAccounts: false,
      };

    case CLEAR_FILTER_FROM:
      return {
        ...state,
        transferFromFilteredAccounts: state.accounts,
        showOtherAccountsFrom: false,
      };

    case CLEAR_FILTER_TO:
      return {
        ...state,
        transferToFilteredAccounts: action.payload,
        showOtherAccountsTo: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: '',
        msg: '',
      };

    default:
      return state;
  }
};
