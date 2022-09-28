import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import { useState, useRef, useContext, useEffect } from 'react';
import AuthContext from '../context/auth/authContext';
import AccountContext from '../context/account/accountContext';
import TransactionContext from '../context/transaction/transactionContext';
import setHeaderToken from '../utils/setHeaderToken';

const NavCustom = (props) => {
  const {
    isAuthenticated,
    user,
    logout: logUserOut,
    loadUser,
  } = useContext(AuthContext);
  const { accounts, getAccounts } = useContext(AccountContext);
  const { getTransactions, transactions } = useContext(TransactionContext);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (localStorage.token) {
      setHeaderToken(localStorage.token);
    }
    console.log(isAuthenticated);

    if (isAuthenticated) {
      console.log('i still got here');
      loadUser();
    }

    console.log('i am auth or not', isAuthenticated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, props.history]);

  const [show, setShow] = useState(false);

  const home = useRef(null);
  const register = useRef(null);
  const login = useRef(null);
  const transfer = useRef(null);
  const withdraw = useRef(null);
  const history = useRef(null);
  const balance = useRef(null);
  const logout = useRef(null);
  const userName = useRef(null);

  const [linkBank, setLinkBank] = useState({
    home: {
      active: true,
    },
    register: {
      active: false,
    },
    login: {
      active: false,
    },
    transfer: {
      active: false,
    },
    withdraw: {
      active: false,
    },
    history: {
      active: false,
    },
    balance: {
      active: false,
    },
    logout: {
      active: false,
    },
    userName: {
      active: false,
    },
  });

  const refBank = {
    home: {
      target: home,
      tooltip: 'This takes you to the amazing BadBank homepage',
    },
    register: {
      target: register,
      tooltip: "Create a BadBank account. It's fast and easy",
    },
    login: {
      target: login,
      tooltip: 'Login to your account',
    },
    transfer: {
      target: transfer,
      tooltip: 'Send funds to other accounts',
    },
    withdraw: {
      target: withdraw,
      tooltip: 'Deposit into your account or make a withdrawal',
    },
    history: {
      target: history,
      tooltip: 'View all of your transactions',
    },
    balance: {
      target: balance,
      tooltip: 'Check your account balance',
    },
    logout: {
      target: logout,
      tooltip: 'Log out of your account',
    },
    userName: {
      target: userName,
      tooltip: 'View and edit your profile',
    },
  };

  const [target, setTarget] = useState(home);

  const [tooltip, setTooltip] = useState(refBank.home.tooltip);

  const onHover = (e) => {
    setTarget(refBank[e.target.id].target);
    setShow(!show);
    setTooltip(refBank[e.target.id].tooltip);
  };

  const onNavClick = (e) => {
    for (let a of Object.keys(linkBank)) {
      linkBank[a].active = false;
    }
    linkBank[e.target.id].active = true;
    console.log(linkBank);
    setLinkBank(linkBank);
  };

  const onLogout = () => {
    logUserOut();
  };

  return (
    <>
      <Navbar expand='sm'>
        <Navbar.Brand className='roboto-c head-logo' href='/home'>
          BadBank
        </Navbar.Brand>

        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse>
          <Nav
            className='nav-cs ubuntu ml-auto'
            aria-controls='basic-navbar-nav'
          >
            {!isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/'
                ref={home}
                id='home'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['home'].active === true ? 'active' : ''}
              >
                Home
              </Nav.Link>
            )}

            {!isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/register'
                ref={register}
                id='register'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['register'].active === true ? 'active' : ''}
              >
                Register
              </Nav.Link>
            )}

            {!isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/login'
                ref={login}
                id='login'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['login'].active === true ? 'active' : ''}
              >
                Login
              </Nav.Link>
            )}

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/transfers'
                ref={transfer}
                id='transfer'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['transfer'].active === true ? 'active' : ''}
              >
                Transfers
              </Nav.Link>
            )}

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/withdraw'
                ref={withdraw}
                id='withdraw'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['withdraw'].active === true ? 'active' : ''}
              >
                Withdraw and Deposit
              </Nav.Link>
            )}

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/history'
                ref={history}
                id='history'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['history'].active === true ? 'active' : ''}
              >
                History
              </Nav.Link>
            )}

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/balance'
                ref={balance}
                id='balance'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['balance'].active === true ? 'active' : ''}
              >
                Balance
              </Nav.Link>
            )}

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/logout'
                ref={logout}
                id='logout'
                onClick={onLogout}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['logout'].active === true ? 'active' : ''}
              >
                Logout
              </Nav.Link>
            )}

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to='/userName'
                ref={userName}
                id='userName'
                onClick={onNavClick}
                onMouseOver={onHover}
                onMouseOut={() => {
                  setShow(!show);
                }}
                className={linkBank['userName'].active === true ? 'active' : ''}
              >
                {user && user.fName}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Overlay target={target.current} show={show} placement='bottom'>
        {(props) => (
          <Tooltip id='over-lay' {...props}>
            {tooltip}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default NavCustom;
