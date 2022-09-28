import { useState, Fragment, useContext, useEffect } from 'react';
//import PropTypes from 'prop-types';
import SelectCustom from '../ui/SelectCustom';
import GenericInput from '../ui/GenericInput';
import Accounts from '../ui/Accounts';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import accountContext from '../context/account/accountContext';
import {
  WITHDRAW,
  FILTER_ACCOUNT_TRANSFER_FROM,
  FILTER_ACCOUNT_TRANSFER_TO,
} from '../context/types.js';
import { TRANSFER_OPTIONS } from '../ui/constants';
import alertContext from '../context/alert/alertContext';

const Transfer = () => {
  // retrieve needed functions and globsal state variables
  const {
    transferFromFilteredAccounts,
    transferToFilteredAccounts,
    action,
    setAction,
    showOtherAccountsFrom,
    showOtherAccountsTo,
    clearFilter,
    accounts,
    filterAccountTransferTo,
    filterAccountTransferFrom,
    clearFilterFrom,
    clearFilterTo,
    transfer,
    error,
    msg,
  } = useContext(accountContext);

  useEffect(() => {
    if (error) {
      setAlert('danger', error);
    }

    if (msg) {
      setAlert('success', msg.msg);
    } // es-lint-disable-next-line
  }, [error, msg]);

  // get the setAlert method from alert context
  const AlertContext = useContext(alertContext);
  const { setAlert } = AlertContext;

  // initialize local state
  const [localState, setLocalState] = useState({
    isVisibleFrom: false,
    isVisibleTo: false,
    showAmount: false,
    action: null,
    error: '',
    accountError: '',
  });
  const [amount, setAmount] = useState(0);
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');

  const onSubmitHandler = () => {
    transfer(amount, beneficiaryAccount).then(() => {
      setAmount(0);
      setBeneficiaryAccount('');
    });
  };

  // on amount field change handler
  const onAmountChange = (e) => {
    setAmount(e.target.value);

    if (
      e.target.value === '0' ||
      e.target.value === '0.0' ||
      e.target.value === '0.00'
    ) {
      setLocalState({
        ...localState,
        error: 'Please enter an amount above zero',
      });
    } else if (e.target.value === '') {
      setLocalState({
        ...localState,
        error: 'Amount field cannot be blank',
      });
    } else if (/[A-Za-z]+/.test(e.target.value)) {
      setLocalState({
        ...localState,
        error: 'Please enter only digits',
      });
    } else if (
      !/^(-?[0-9]+\.?[0-9]{0,2}|0?\.[0-9]{0,2})$/.test(e.target.value)
    ) {
      setLocalState({
        ...localState,
        error:
          'Please enter the amount in a valid format (a number with two decimals e.g $25.99)...',
      });
    } else {
      setLocalState({ ...localState, error: '' });
    }
  };

  const onShowOtherAccountsClickedFrom = (type) => {
    setLocalState({ ...localState, isVisibleTo: false });
    clearFilterFrom();
  };
  const onShowOtherAccountsClickedTo = (type) => {
    clearFilterTo();
  };

  const onBeneficiaryAccountChange = (e) => {
    setBeneficiaryAccount(e.target.value);

    if (e.target.value === '') {
      setLocalState({
        ...localState,
        accountError: 'Amount number is required',
      });
    } else if (/[A-Za-z]+/.test(e.target.value)) {
      setLocalState({
        ...localState,
        accountError: 'Please enter only digits',
      });
    } else if (e.target.value.length < 8) {
      setLocalState({
        ...localState,
        accountError:
          'Please enter a valid account number. Valid account numbers have 8 digits',
      });
    } else {
      setLocalState({ ...localState, accountError: '' });
    }
  };

  const onChange = (e) => {
    clearFilter(FILTER_ACCOUNT_TRANSFER_FROM);
    clearFilter(FILTER_ACCOUNT_TRANSFER_TO);
    if (e.target.value === '0') {
      setAction(null);
      setLocalState({
        ...localState,
        isVisibleFrom: false,
        isVisibleTo: false,
        showAmount: false,
      });
    } else if (e.target.value === 'SELF') {
      // show the users accounts
      if (transferFromFilteredAccounts.length === 1) {
        // user has only one account. Cannot transfer to self
        // set only account as clicked account

        setAlert(
          'danger',
          `You have only onr account. You cant transfer to yourself. 
          You might want to deposit or open a new account`
        );
        setLocalState({
          ...localState,
          isVisibleFrom: false,
          isVisibleTo: false,
          showAmount: false,
        });
        e.target.value = 0;
      } else {
        setLocalState({
          ...localState,
          isVisibleFrom: true,
          isVisibleTo: false,
          showAmount: false,
        });
      }
    } else if (e.target.value === 'OTHERS') {
      // show the users accounts to transfer from and form to input beneficiaries account number
      setLocalState({
        ...localState,
        isVisibleFrom: true,
        isVisibleTo: true,
        showAmount: true,
      });
      // show the users accounts
      if (transferFromFilteredAccounts.length === 1) {
        const accountNumber = transferFromFilteredAccounts[0].accountNumber;
        console.log(accountNumber);
        filterAccountTransferFrom(accountNumber);
      }
    }

    setAction(e.target.value.toUpperCase());
  };

  const onFromAccountClicked = (e) => {
    setLocalState({ ...localState, isVisibleTo: true });
    const accountNumber = e.target.getAttribute('data-account');

    filterAccountTransferFrom(accountNumber);
  };
  const onToAccountClicked = (e) => {
    console.log('TOS');
    const accountNumber = e.target.getAttribute('data-account');
    filterAccountTransferTo(accountNumber);
  };

  let accountLayoutStyleFrom = showOtherAccountsFrom
    ? { span: 4, offset: 4 } //centre it
    : { span: 4 }; // tile it

  console.log(accountLayoutStyleFrom);

  const accountLayoutStyleTo = showOtherAccountsTo
    ? { span: 4, offset: 4 }
    : { span: 4 };

  return (
    <Card>
      <Card.Header>Transfers</Card.Header>
      <Card.Body>
        <SelectCustom
          label='Who are you transferring to?'
          options={TRANSFER_OPTIONS}
          onChange={onChange}
        />
        {localState.isVisibleFrom && (
          <Fragment>
            <Row className='mt-4'>
              <hr />
            </Row>

            <Row>
              {!(showOtherAccountsFrom && accounts.length !== 1) && (
                <p>Click on account you want to transfer from</p>
              )}
              {showOtherAccountsFrom && accounts.length !== 1 && (
                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 4, offset: 4 }}
                >
                  <Button
                    className='btn btn-block m-top'
                    onClick={onShowOtherAccountsClickedFrom}
                    value='Choose Account To Transfer From'
                    style={{ width: '100%' }}
                    data-type={transferFromFilteredAccounts}
                  >
                    Choose from other accounts'
                  </Button>
                </Col>
              )}
            </Row>

            <Accounts
              accounts={transferFromFilteredAccounts}
              mdDynamicLayout={accountLayoutStyleFrom}
              onClickHandler={onFromAccountClicked}
            />
          </Fragment>
        )}
        {localState.isVisibleTo && (
          <Fragment>
            {!localState.showAmount && (
              <Fragment>
                <Row>
                  {!(
                    showOtherAccountsTo &&
                    transferToFilteredAccounts.length !== 1
                  ) && <p>Click on account you want to transfer to</p>}

                  {showOtherAccountsTo && (
                    <Col
                      xs={{ span: 12 }}
                      sm={{ span: 12 }}
                      md={{ span: 4, offset: 4 }}
                    >
                      <Button
                        className='btn btn-block m-top'
                        onClick={onShowOtherAccountsClickedTo}
                        value='Show Other Accounts'
                        style={{ width: '100%' }}
                        data-type={transferFromFilteredAccounts}
                      >
                        Transfer to another account
                      </Button>
                    </Col>
                  )}
                </Row>
                <Accounts
                  accounts={transferToFilteredAccounts}
                  mdDynamicLayout={accountLayoutStyleTo}
                  onClickHandler={onToAccountClicked}
                />
              </Fragment>
            )}

            <Row>
              <Col
                xs={{ span: 12 }}
                sm={{ span: 12 }}
                md={{ span: 4, offset: 4 }}
              >
                {localState.showAmount && (
                  <GenericInput
                    type='text'
                    fieldName='beneficiaryAccount'
                    className='form-control'
                    onChangeHandler={onBeneficiaryAccountChange}
                    label="Enter receiver's account number"
                    error={localState.accountError}
                    value={beneficiaryAccount}
                    format='123-456-0789'
                  />
                )}
                <GenericInput
                  type='text'
                  fieldName='withdrawAmount'
                  className='form-control'
                  onChangeHandler={onAmountChange}
                  label='Enter amount'
                  error={localState.error}
                  value={amount}
                />
              </Col>
              <Col
                xs={{ span: 12 }}
                sm={{ span: 12 }}
                md={{ span: 4, offset: 4 }}
              >
                <Button
                  onClick={onSubmitHandler}
                  className='m-top'
                  style={{ width: '100%' }}
                  disabled={
                    localState.error || localState.accountError ? true : false
                  }
                >
                  TRANSFER
                </Button>
              </Col>
            </Row>
          </Fragment>
        )}
      </Card.Body>
    </Card>
  );
};

//withdraw.propTypes = {};

export default Transfer;
