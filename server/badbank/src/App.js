import './App.css';
import { Switch, Route } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import NavCustom from './components/ui/NavCustom';
import AlertCustom from './components/ui/AlertCustom';
import PrivateRoute from './components/routing/PrivateRoute';
import CustomSpinner from './components/ui/CustomSpinner';
import login from './components/pages/login';
import logout from './components/pages/logout';
import register from './components/pages/register';
import home from './components/pages/home';
import history from './components/pages/history';
import transfers from './components/pages/transfers';
import balance from './components/pages/balance';
import user from './components/pages/user';
import withdraw from './components/pages/withdraw';
import AuthState from './components/context/auth/AuthState';
import AlertState from './components/context/alert/AlertState';
import AccountState from './components/context/account/AccountState';
import TransactionState from './components/context/transaction/TransactionState';
import Cookies from 'js-cookie';
import setHeaderToken from './components/utils/setHeaderToken';

function App() {
  console.log(Cookies.get('token'));
  if (Cookies.get('token')) {
    setHeaderToken(Cookies.get('token'));
  }
  return (
    <AuthState>
      <AlertState>
        <AccountState>
          <TransactionState>
            <Container fluid>
              <Row className='header'>
                <NavCustom />
              </Row>
              <CustomSpinner />
              <AlertCustom />

              <Switch>
                <Route path='/register' component={register}></Route>
                <PrivateRoute path='/history' component={history} />
                <PrivateRoute path='/transfers' component={transfers} />
                <PrivateRoute path='/withdraw' component={withdraw} />
                <PrivateRoute path='/balance' component={balance} />
                <PrivateRoute path='/userName' component={user} />
                <Route path='/login' component={login}></Route>
                <Route path='/logout' component={logout}></Route>
                <Route path='/' component={home}></Route>
              </Switch>
            </Container>
          </TransactionState>
        </AccountState>
      </AlertState>
    </AuthState>
  );
}

export default App;
