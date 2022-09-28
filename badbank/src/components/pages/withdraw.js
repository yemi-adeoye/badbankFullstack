/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, Fragment, useContext } from 'react';
//import PropTypes from 'prop-types';
import SelectCustom from '../ui/SelectCustom';
import GenericInput from '../ui/GenericInput';
import Accounts from '../ui/Accounts';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import accountContext from '../context/account/accountContext';
import { WITHDRAW, FILTER_ACCOUNT_WITHDRAW } from '../context/types.js';
import { WITHDRAW_OPTIONS } from '../ui/constants';
import alertContext from '../context/alert/alertContext';

const Withdraw = () => {
  // retrieve needed functions and globsal state variables
  const {
    withDrawFilteredAccounts,
    action,
    setAction,
    showOtherAccounts,
    clearFilter,
    depositOrWithdraw,
    filterAccountsWithdraw,
    error,
    msg,
  } = useContext(accountContext);
  const AlertContext = useContext(alertContext);
  const { setAlert } = AlertContext;

  // initialize local state
  const [localState, setLocalState] = useState({
    isVisible: false,
    showAmount: false,
    error: '',
    disabled: true,
  });

  const [amount, setAmount] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);

  const onSubmitHandler = (e) => {
    const action = e.target.value.toLowerCase();
    depositOrWithdraw(action, amount).then(() => {});
    setAmount(0);
    setFirstLoad(true);
    setLocalState({ ...localState, disabled: true });
  };

  const onClick = (e) => {
    // set the current account to clicked account in global state
    e.stopPropagation();

    const accountNumber = e.target.getAttribute('data-account');
    console.log(accountNumber);
    filterAccountsWithdraw(accountNumber);
  };

  // on amount field change handler
  const onAmountChange = (e) => {
    setAmount(e.target.value);
    setFirstLoad(false);

    console.log(firstLoad);
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
      setLocalState({ ...localState, error: 'Amount field cannot be blank' });
    } else if (/[A-Za-z]+/.test(e.target.value)) {
      setLocalState({ ...localState, error: 'Please enter only digits' });
    } else if (e.target.value[0] === '-') {
      setLocalState({
        ...localState,
        error: 'Please enter positive digits only',
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

  const onShowOtherAccountsClicked = () => {
    clearFilter(FILTER_ACCOUNT_WITHDRAW);
  };

  const onChange = (e) => {
    clearFilter(FILTER_ACCOUNT_WITHDRAW);
    if (e.target.value === '0') {
      console.log('here');
      setAction(null);
      setLocalState({ ...localState, isVisible: false });
    } else {
      setLocalState({ ...localState, isVisible: true });
    }

    setAction(e.target.value.toUpperCase());
  };

  const accountLayoutStyle =
    showOtherAccounts || withDrawFilteredAccounts.length === 1
      ? { span: 4, offset: 4 }
      : { span: 4 };

  useEffect(() => {
    if (error) {
      setAlert('danger', error);
    }

    if (msg) {
      setAlert('success', msg.msg);
    } // es-lint-disable-next-line
  }, [error, msg]);

  return (
    <Card>
      <Card.Header>Your accounts</Card.Header>
      <Card.Body>
        <SelectCustom
          label='What would you like to do?'
          onChange={onChange}
          options={WITHDRAW_OPTIONS}
        />

        {localState.isVisible && (
          <Fragment>
            <Row>
              <p>
                Select account to {action.toLowerCase()}{' '}
                {action === WITHDRAW ? 'from' : 'into'}
              </p>
              <hr />
            </Row>

            {showOtherAccounts && (
              <Row>
                <Col
                  xs={{ span: 12 }}
                  sm={{ span: 12 }}
                  md={{ span: 4, offset: 4 }}
                >
                  <Button
                    className='btn btn-block m-top'
                    onClick={onShowOtherAccountsClicked}
                    value='Show Other Accounts'
                    style={{ width: '100%' }}
                  >
                    Show Other Accounts
                  </Button>
                </Col>{' '}
              </Row>
            )}

            <Accounts
              accounts={withDrawFilteredAccounts}
              mdDynamicLayout={accountLayoutStyle}
              onClickHandler={onClick}
            />

            <Row>
              <Col
                xs={{ span: 12 }}
                sm={{ span: 12 }}
                md={{ span: 4, offset: 4 }}
              >
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
                    (localState.error && firstLoad === false) ||
                    firstLoad === true
                  }
                  value={action}
                >
                  {action}
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

export default Withdraw;
