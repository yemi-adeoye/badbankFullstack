import { Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';

const UserDetail = ({ accountType, accountNumber, balance, fName, lName }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return (
    <Fragment>
      <Col
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
        className='balance m-auto mb-4'
        xs={{ span: 12 }}
        sm={{ span: 12 }}
        md={{ span: 6 }}
        lg={{ span: 6 }}
      >
        <span className='text-end p-2'>Account Name</span>
        <span className='text-start p-2'>{fName + ' ' + lName}</span>

        <span className='text-end p-2'>Account Type</span>
        <span className='text-start p-2'>{accountType}</span>

        <span className='text-end p-2'>Account Number</span>
        <span className='text-start p-2'>{accountNumber}</span>

        <span className='text-end p-2'>Current Balance</span>
        <span className='text-start p-2'>{formatter.format(balance)}</span>
      </Col>
    </Fragment>
  );
};

export default UserDetail;
