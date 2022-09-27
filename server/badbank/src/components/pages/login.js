import LoginForm from '../ui/LoginForm';
import Col from 'react-bootstrap/Col';
import authContext from '../context/auth/authContext';
import alertContext from '../context/alert/alertContext';
import setHeaderToken from '../utils/setHeaderToken';
import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const Login = (props) => {
  const AuthContext = useContext(authContext);
  const AlertContext = useContext(alertContext);

  const { isAuthenticated, error, loadUser, loading, clearErrors } =
    AuthContext;
  const { setAlert } = AlertContext;
  //if (localStorage.token) {
  if (Cookies.get('token')) {
    setHeaderToken(Cookies.get('token'));
    loadUser();
  }
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    if (error && loading === false) {
      console.log('collected error');
      setAlert('danger', error);
      clearErrors();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading]);

  return (
    <Col
      xs={{ span: 12 }}
      sm={{ span: 8, offset: 2 }}
      md={{ span: 8, offset: 2 }}
      lg={{ span: 6, offset: 3 }}
      style={{ marginTop: '15vh' }}
    >
      <LoginForm />
    </Col>
  );
};

export default Login;
