import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import accountContext from '../context/account/accountContext';
import transactionContext from '../context/transaction/transactionContext';
import { FILTER_ACCOUNT_WITHDRAW, DEBIT, CREDIT } from '../context/types.js';
import { useState, Fragment, useContext } from 'react';
import Accounts from '../ui/Accounts';
import SelectCustom from '../ui/SelectCustom';
import Transaction from '../ui/Transaction';
import { FILTER_OPTIONS } from '../ui/constants';
import authContext from '../context/auth/authContext';

function History() {
  const { loadUser, isAuthenticated } = useContext(authContext);
  useEffect(() => {
    loadUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const [value, setValue] = useState(0);
  const {
    showOtherAccounts,
    withDrawFilteredAccounts,
    clearFilter,
    filterAccountsWithdraw,
  } = useContext(accountContext);

  const {
    filtered,
    filterByAccount,
    clearFilter: clearTransFilter,
    filterByYou,
    filterByType,
    filterByOthers,
  } = useContext(transactionContext);

  const onSelectChange = (e) => {
    switch (e.target.value) {
      case 'SELF':
        filterByYou();
        break;
      case 'OTHERS':
        filterByOthers();
        break;
      case 'DEBIT':
      case 'CREDIT':
        filterByType(e.target.value.toLowerCase());
        break;
      default:
        return;
    }
  };

  const accountLayoutStyle =
    showOtherAccounts || withDrawFilteredAccounts.length === 1
      ? { span: 4, offset: 4 }
      : { span: 4 };

  const onClick = (e) => {
    // set the current account to clicked account in global state
    e.stopPropagation();

    const accountNumber = e.target.getAttribute('data-account');
    console.log(accountNumber);
    filterAccountsWithdraw(accountNumber);
    filterByAccount(accountNumber);
    setValue(0);
  };

  const onShowOtherAccountsClicked = () => {
    clearFilter(FILTER_ACCOUNT_WITHDRAW);
    clearTransFilter();
    setValue(0);
  };
  console.log(withDrawFilteredAccounts.length);
  return (
    <Card>
      <Card.Header>Transaction history</Card.Header>
      <Card.Body>
        {showOtherAccounts && withDrawFilteredAccounts.length !== 1 && (
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
            </Col>
          </Row>
        )}

        <Accounts
          accounts={withDrawFilteredAccounts}
          onClickHandler={onClick}
          mdDynamicLayout={accountLayoutStyle}
        />
        <Row>
          <SelectCustom
            onChange={onSelectChange}
            label='Show only transactions that are'
            options={FILTER_OPTIONS}
            value={value}
          />
        </Row>
        <Transaction transactions={filtered} />
      </Card.Body>
    </Card>
  );
}

History.propTypes = {};

export default History;
