import { useEffect, useContext } from 'react';
import authContext from '../context/auth/authContext';

const GoogleLogin = ({ APP_ID, classVal, ...rest }) => {
  const AuthContext = useContext(authContext);
  const { googleLogin } = AuthContext;

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: APP_ID,
      callback: googleLogin,
    });
    window.google.accounts.id.renderButton(
      document.getElementById('buttonDiv'),
      { theme: 'filled_blue', width: '400px', size: 'large' } // customization attributes
    );
  }, []);

  return (
    <div
      id='buttonDiv'
      className={classVal}
      onClick={googleLogin}
      {...rest}
    ></div>
  );
};

export default GoogleLogin;
