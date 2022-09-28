import { useEffect, useContext, useState, Fragment } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import GenericInput from '../ui/GenericInput';
import Accounts from '../ui/Accounts';
import accountContext from '../context/account/accountContext';
import authContext from '../context/auth/authContext';
import setHeaderToken from '../utils/setHeaderToken';
import faker from 'faker';
import alertContext from '../context/alert/alertContext';

export default function Balance(props) {
  const { accounts, addAccount, error, msg } = useContext(accountContext);
  const { loadUser, isAuthenticated, user } = useContext(authContext);

  if (localStorage.token) {
    setHeaderToken(localStorage.token);
  }

  const accountNumber = faker.finance.account();

  useEffect(() => {
    loadUser();

    if (error) {
      setAlert('danger', error);
    }

    if (msg) {
      setAlert('success', msg.msg);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  // get the setAlert method from alert context
  const AlertContext = useContext(alertContext);
  const { setAlert } = AlertContext;

  const [visible, setVisible] = useState(false);
  const [accountType, setAccountType] = useState('');
  const onAccountAdd = () => {
    setVisible(!visible);
  };
  const addNewAccount = () => {
    console.log(accountType, accountNumber);
    const body = {
      userId: user._id,
      accountType,
      accountNumber,
    };
    console.log(body);
    addAccount(body);
  };

  const onChange = (e) => {
    setAccountType(e.target.value);
  };

  return (
    <Card>
      <Card.Header>Your account{accounts.length > 1 ? 's' : ''}</Card.Header>
      <Card.Body>
        <Button onClick={onAccountAdd} style={{ marginBottom: '20px' }}>
          {visible ? (
            'Hide'
          ) : (
            <Fragment>
              <i className='fa fa-plus' aria-hidden='true'></i> New Account
            </Fragment>
          )}
        </Button>
        {visible && (
          <div
            style={{
              border: '1px solid #ccc',
              boxShadow: '#333 1px 2px 2px 1px',
            }}
            className=' m-4 p-4'
          >
            <GenericInput
              type='text'
              fieldName='txtAccountNumber'
              value={accountNumber}
              label='Account Number'
              readOnly
            />
            <label
              htmlFor='accountType'
              className='ms-4'
              style={{
                backgroundColor: 'transparent',
                display: 'block',
              }}
            >
              Select account type
            </label>
            <select
              id='accountType'
              name='accountType'
              className='form-control mt-0 ms-4'
              style={{ width: '50%' }}
              onChange={onChange}
            >
              <option value=''>Choose Account</option>
              <option value='Checking'>Checking</option>
              <option value='Savings'>Savings</option>
            </select>
            <Button
              onClick={addNewAccount}
              disabled={!accountType}
              className='m-4'
            >
              Create Account
            </Button>
          </div>
        )}
        <Accounts accounts={accounts} mdDynamicLayout={{ span: 4 }} />
      </Card.Body>
    </Card>
  );
}
