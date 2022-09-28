import { useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import AuthContext from '../context/auth/authContext';
import GoogleLogin from '../ui/GoogleLogin';

const style = { marginBottom: '30px' };

const LoginForm = () => {
  // get auth Context
  const { login } = useContext(AuthContext);

  // state variables
  const [emailOrAccount, setEmailOrAccount] = useState('');
  const [password, setPassword] = useState('');

  const LoginUser = (e) => {
    e.preventDefault();
    e.stopPropagation();

    login(emailOrAccount, password);
  };

  return (
    <Col
      xs={{ span: 12 }}
      sm={{ span: 12 }}
      md={{ span: 10, offset: 1 }}
      lg={{ span: 10, offset: 1 }}
    >
      <form onSubmit={LoginUser}>
        <label htmlFor='txtLogin'>Email Address</label>
        <input
          type='text'
          placeholder='user@email.com'
          name='txtLogin'
          required
          className='form-control'
          style={style}
          onChange={(e) => setEmailOrAccount(e.target.value)}
        />
        <label htmlFor='txtLogin'>Password</label>
        <input
          className='form-control'
          type='password'
          name='txtPwrd'
          required
          style={style}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className='form-control btn btn-primary'
          type='submit'
          value='LOGIN'
        />
        <div className='span-2 mx-4 text-center'>OR</div>
        <GoogleLogin
          APP_ID='347436993648-tgdrqu1589ho2j2p1c6q30rb8r67253j.apps.googleusercontent.com'
          style={{ width: '100%' }}
          classVal='mt-4'
        />
      </form>
    </Col>
  );
};

export default LoginForm;
