import { useEffect, useContext, useState, Fragment } from 'react';
import moneyGrow from '../../images/moneyGrow.jpg';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Users from '../ui/Users';
import accountContext from '../context/account/accountContext';
import authContext from '../context/auth/authContext';
import TimeAgo from 'react-timeago';

const User = () => {
  const { accounts } = useContext(accountContext);
  const { user } = useContext(authContext);
  return (
    <Card>
      <Card.Header>
        {user.fName + ' ' + user.lName}
        <br />
        <h6>
          Joined: <TimeAgo date={user.created} />
        </h6>
      </Card.Header>
      <Card.Body>
        <Col className='text-center'>
          <h4>Your account{accounts.length > 1 ? 's' : ''}</h4>
        </Col>
        <hr /> <Users accounts={accounts} user={user} />
      </Card.Body>
    </Card>
  );
};

export default User;
