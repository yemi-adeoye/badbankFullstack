import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import TimeAgo from 'react-timeago';

function Transaction({ transactions }) {
  if (!transactions) {
    return <Row>No transactions to view at this time</Row>;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Row className='m-lg-4 m-md-4 m-sm-1 m-xs-0'>
      <Table bordered>
        <thead className='text-center'>
          <th>Transacted At</th>
          <th>Beneficiary</th>
          <th>Transacted By</th>
          <th>Amount</th>
          <th>Type</th>
        </thead>
        <tbody>
          {transactions &&
            transactions.map((transaction) => {
              const typeStyle =
                transaction.transactionType === 'debit'
                  ? { color: 'red' }
                  : { color: 'green' };
              return (
                <tr>
                  <td className='text-center'>
                    <TimeAgo date={transaction.transactedAt} />
                  </td>
                  <td className='text-center'>
                    {transaction.beneficiary.fName +
                      ' ' +
                      transaction.beneficiary.lName}
                  </td>
                  <td className='text-center'>
                    {transaction.transactedBy.fName ===
                      transaction.beneficiary.fName &&
                    transaction.transactedBy.lName ===
                      transaction.beneficiary.lName
                      ? 'SELF'
                      : transaction.transactedBy.fName +
                        ' ' +
                        transaction.transactedBy.lName}
                  </td>
                  <td className='text-end' style={typeStyle}>
                    {formatter.format(transaction.amount)}
                  </td>
                  <td className='text-center'>
                    <span
                      style={{
                        border: '1px solid ' + typeStyle.color,
                        padding: '4px',
                        borderRadius: '5px',
                        display: 'block',
                        width: '95%',
                      }}
                      className='m-auto'
                    >
                      {transaction.transactionType}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Row>
  );
}

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
};

export default Transaction;
