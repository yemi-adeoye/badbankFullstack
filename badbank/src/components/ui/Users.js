import UserDetails from './UserDetail';
import Col from 'react-bootstrap/Col';
import React from 'react';

const Users = ({ accounts, user }) => {
  const { fName, lName } = user;
  return accounts.map((account) => {
    const { accountType, accountNumber, balance } = account;
    const group = (
      <Col>
        <UserDetails
          accountNumber={accountNumber}
          balance={balance}
          accountType={accountType}
          fName={fName}
          lName={lName}
        />
      </Col>
    );

    return <Col>{group}</Col>;
  });
};

export default Users;
