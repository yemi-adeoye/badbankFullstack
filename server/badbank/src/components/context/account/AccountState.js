import AccountContext from './accountContext';
import accountReducer from './accountReducer';
import { useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import authContext from '../auth/authContext';

import {
  FILTER_ACCOUNT_WITHDRAW,
  FILTER_ACCOUNT_TRANSFER_FROM,
  FILTER_ACCOUNT_TRANSFER_TO,
  SET_ACTION,
  CLEAR_FILTER,
  CLEAR_FILTER_TO,
  CLEAR_FILTER_FROM,
  GET_ACCOUNTS,
  DEPOSIT_ERROR,
  DEPOSIT_SUCCESS,
  TRANSFER_SUCCESS,
  TRANSFER_ERROR,
  CLEAR_ERRORS,
  LOADING,
  GET_ACCOUNTS_FAIL,
  ADD_ACCOUNT_FAIL,
  ADD_ACCOUNT_SUCCESS,
} from '../types.js';

const AccountState = (props) => {
  const initialState = {
    accountNumber: null,
    accountNumberFrom: null,
    accountNumberTo: null,
    showOtherAccounts: false,
    action: null,
    isVisible: false,
    showOtherAccountsFrom: false,
    showOtherAccountsTo: false,
    accounts: [],
    error: null,
    msg: null,
    loading: false,
  };

  initialState.withDrawFilteredAccounts = initialState.accounts;
  initialState.transferFromFilteredAccounts = initialState.accounts;
  initialState.transferToFilteredAccounts = initialState.accounts;

  const [state, dispatch] = useReducer(accountReducer, initialState);

  // set action
  const setAction = (action) => {
    dispatch({ payload: action, type: SET_ACTION });
  };

  const clearErrors = () => {
    console.log('clearing ...');
    dispatch({ type: CLEAR_ERRORS });
  };

  // deposit AND WITHDRAWASL HELPER FUNCTION
  const doDepositOrWithdraw = async (action, accountNumber, amount) => {
    dispatch({ type: LOADING });
    const data = {
      action,
      accountNumber,
      amount,
    };
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return axios.put('/api/account', data, options);
  };

  const depositOrWithdraw = async (action, amount, acc = null) => {
    const accountNumber = acc
      ? acc
      : state.withDrawFilteredAccounts[0].accountNumber;

    doDepositOrWithdraw(action, accountNumber, amount)
      .then((res) => {
        console.log(res.data);
        dispatch({ payload: res.data, type: DEPOSIT_SUCCESS });
        getAccounts();
        clearErrors();
        return true;
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        dispatch({ payload: err.response.data.msg, type: DEPOSIT_ERROR });
        return false;
      });
  };

  const transfer = async (amount, accountTo = null) => {
    dispatch({ type: LOADING });
    let accTo;

    if (!accountTo) {
      accTo = transferToFilteredAccounts[0].accountNumber;
    } else {
      accTo = accountTo;
    }

    const accountFrom = transferFromFilteredAccounts[0].accountNumber;

    doDepositOrWithdraw('withdraw', accountFrom, amount)
      .then(() => {
        doDepositOrWithdraw('deposit', accTo, amount)
          .then(() => {
            dispatch({
              payload: { msg: 'Transfer successful' },
              type: TRANSFER_SUCCESS,
            });
            clearErrors();
            getAccounts();
          })
          .catch(() => {
            dispatch({
              payload: 'Transfer failed',
              type: TRANSFER_ERROR,
            });
          });
      })
      .catch(() => {
        // dispatch transfer success
        dispatch({
          payload: 'Transfer failed',
          type: TRANSFER_ERROR,
        });
      });
  };

  // get Accounts
  const getAccounts = () => {
    axios
      .get(`/api/account/`)
      .then((res) => {
        dispatch({ payload: res.data.account, type: GET_ACCOUNTS });
      })
      .catch((err) => {
        dispatch({
          payload: "Please try refreshing browser; couldn't get accounts",
          type: GET_ACCOUNTS_FAIL,
        });
      });
  };

  // transfer to self

  // trannsfer to others

  // filter accounts
  const filterAccountsWithdraw = (accountNumber) => {
    const selectedAccount = state.accounts.filter((account) => {
      return account.accountNumber === accountNumber;
    });
    dispatch({ payload: selectedAccount, type: FILTER_ACCOUNT_WITHDRAW });
  };

  const filterAccountTransferFrom = (accountNumber) => {
    const fromAcc = state.accounts.filter((account) => {
      return account.accountNumber === accountNumber;
    });
    const toAcc = state.accounts.filter((account) => {
      return account.accountNumber !== accountNumber;
    });

    dispatch({
      payload: { fromAcc, toAcc },
      type: FILTER_ACCOUNT_TRANSFER_FROM,
    });
  };

  const filterAccountTransferTo = (accountNumber) => {
    const selectedAccount = state.transferToFilteredAccounts.filter(
      (account) => {
        return account.accountNumber === accountNumber;
      }
    );
    dispatch({ payload: selectedAccount, type: FILTER_ACCOUNT_TRANSFER_TO });
  };

  //clear filter
  const clearFilter = (filterToClear) => {
    dispatch({ payload: filterToClear, type: CLEAR_FILTER });
  };

  const clearFilterTo = () => {
    const selectedAccount = state.accounts.filter((account) => {
      return account.accountNumber !== state.accountNumberFrom;
    });
    dispatch({
      payload: selectedAccount,
      type: CLEAR_FILTER_TO,
    });
  };

  const clearFilterFrom = () => {
    dispatch({
      type: CLEAR_FILTER_FROM,
    });
  };

  // add account
  const addAccount = (data) => {
    console.log('wanna add');
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    axios
      .post(`/api/account/`, data, options)
      .then((res) => {
        dispatch({ payload: [res.data.account], type: ADD_ACCOUNT_SUCCESS });
      })
      .catch((err) => {
        dispatch({
          payload: err.response.data.msg,
          type: ADD_ACCOUNT_FAIL,
        });
      });
    getAccounts();
  };

  // disable account

  const {
    accountNumber,
    action,
    accounts,
    isVisible,
    showOtherAccounts,
    showOtherAccountsFrom,
    showOtherAccountsTo,
    withDrawFilteredAccounts,
    transferFromFilteredAccounts,
    transferToFilteredAccounts,
    msg,
    error,
    loading,
  } = state;

  return (
    <AccountContext.Provider
      value={{
        accountNumber,
        action,
        accounts,
        depositOrWithdraw,
        filterAccountsWithdraw,
        filterAccountTransferFrom,
        filterAccountTransferTo,
        clearFilterTo,
        clearFilterFrom,
        transferFromFilteredAccounts,
        transferToFilteredAccounts,
        withDrawFilteredAccounts,
        setAction,
        clearFilter,
        showOtherAccountsFrom,
        showOtherAccountsTo,
        showOtherAccounts,
        isVisible,
        msg,
        error,
        transfer,
        clearErrors,
        loading,
        getAccounts,
        addAccount,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountState;
