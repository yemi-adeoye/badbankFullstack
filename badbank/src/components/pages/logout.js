import { useContext, useEffect } from 'react';
import authContext from '../context/auth/authContext';

const Logout = (props) => {
  const AuthContext = useContext(authContext);
  const { logout, isAuthenticated } = AuthContext;

  useEffect(() => {
    logout();
    props.history.push('/');
  }, []);

  return <div>You've been successfully logged out.</div>;
};

export default Logout;
