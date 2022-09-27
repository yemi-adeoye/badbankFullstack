import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { Fragment, useContext } from 'react';
import accountContext from '../context/account/accountContext';
import authContext from '../context/auth/authContext';
import spinner from '../../images/spinner.gif';

function CustomSpinner() {
  const AccountContext = useContext(accountContext);
  const { loading: loadingAcc } = AccountContext;
  const AuthContext = useContext(authContext);
  const { loading: loadingAuth } = AuthContext;

  return (
    <Col className='m-auto col-1' style={{}}>
      {(loadingAcc || loadingAuth) && (
        <Image src={spinner} fluid className='text-end' />
      )}
    </Col>
  );
}

export default CustomSpinner;
