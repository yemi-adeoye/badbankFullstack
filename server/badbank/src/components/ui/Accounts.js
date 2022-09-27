import { useRef, createRef } from 'react';
import Row from 'react-bootstrap/Row';
import AccountItem from './AccountItem';
import PropTypes from 'prop-types';

const Accounts = ({ accounts, mdDynamicLayout, onClickHandler }) => {
  const acc = accounts.map((account, count) => {
    console.log(account);
    return (
      <AccountItem
        accountType={account.accountType}
        balance={account.balance}
        accountNumber={account.accountNumber}
        key={account.accountNumber}
        mdDynamicLayout={mdDynamicLayout}
        onClickHandler={onClickHandler}
      />
    );
  });
  return <Row>{acc}</Row>;
};

Accounts.propTypes = {
  accounts: PropTypes.array.isRequired,
};

export default Accounts;
