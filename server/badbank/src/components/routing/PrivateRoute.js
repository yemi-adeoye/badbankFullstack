import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import authContext from '../context/auth/authContext';

function PrivateRoute({ component: Component, ...rest }) {
  const AuthContext = useContext(authContext);
  const { isAuthenticated, loading } = AuthContext;
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
}

export default PrivateRoute;
