import transactionReducer from './transactionReducer';
import transactionContext from './transactionContext';
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import {
  TRANS_FILTER_BY_ACCOUNT,
  TRANS_FILTER_BY_TYPE,
  CLEAR_FILTER,
  TRANS_FILTER_BY_YOU,
  GET_TRANSACTIONS,
} from '../types';

const TransactionState = (props) => {
  const initialState = {
    transactions: null,
    filtered: null,
  };

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const getTransactions = () => {
    axios
      .get('api/transaction/')
      .then((res) => {
        console.log('data', res.data.transactions);
        dispatch({ payload: res.data, type: GET_TRANSACTIONS });
      })
      .catch((err) => {
        return err;
      });
  };

  // filter transaction by account
  const filterByAccount = (accountNumber) => {
    console.log('filtering by account...');
    const filtered = state.transactions.filter((transaction) => {
      return transaction.accountId.accountNumber === accountNumber;
    });
    console.log('filtered', filtered);

    dispatch({ payload: filtered, type: TRANS_FILTER_BY_ACCOUNT });
  };

  // filter transaction by type
  const filterByType = (type) => {
    const filtered = state.transactions.filter((transaction) => {
      return transaction.transactionType === type;
    });
    dispatch({ payload: filtered, type: TRANS_FILTER_BY_TYPE });
  };

  // filter transaction by type
  const filterByYou = () => {
    const filtered = state.transactions.filter((transaction) => {
      return transaction.transactedBy._id === transaction.beneficiary._id;
    });
    dispatch({ payload: filtered, type: TRANS_FILTER_BY_YOU });
  };

  // filter transaction by type
  const filterByOthers = () => {
    const filtered = state.transactions.filter((transaction) => {
      return transaction.transactedBy._id !== transaction.beneficiary._id;
    });
    dispatch({ payload: filtered, type: TRANS_FILTER_BY_YOU });
  };

  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  const { transactions, filtered } = state;

  return (
    <transactionContext.Provider
      value={{
        filterByAccount,
        filterByType,
        clearFilter,
        transactions,
        filtered,
        filterByYou,
        filterByOthers,
        getTransactions,
      }}
    >
      {props.children}
    </transactionContext.Provider>
  );
};

export default TransactionState;
