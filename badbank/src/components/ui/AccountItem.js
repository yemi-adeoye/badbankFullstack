import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import PropTypes from 'prop-types';
const AccountItem = ({
  accountType,
  accountNumber,
  balance,
  mdDynamicLayout,
  onClickHandler,
  ref,
}) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return (
    <Col
      className='balance'
      xs={{ span: 10, offset: 1 }}
      sm={{ span: 10, offset: 1 }}
      md={mdDynamicLayout}
      lg={mdDynamicLayout}
      onClick={onClickHandler}
      data-account={accountNumber}
      ref={ref}
    >
      <Badge xs={{ span: 2 }} className='' bg='dark'>
        {accountNumber}
      </Badge>

      <Col
        className='balance-digit'
        xs={{ span: 12 }}
        data-account={accountNumber}
        onClick={onClickHandler}
      >
        {formatter.format(balance)}
      </Col>
      <Badge bg={accountType === 'Checking' ? 'primary' : 'secondary'}>
        {accountType}
      </Badge>
    </Col>
  );
};

AccountItem.propTypes = {
  accountType: PropTypes.string.isRequired,
  accountNumber: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  mdDynamicLayout: PropTypes.object.isRequired,
};
export default AccountItem;
