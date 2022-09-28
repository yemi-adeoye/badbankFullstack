import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import axios from 'axios';
import setHeaderToken from '../../utils/setHeaderToken';
//import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

import {
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_ERRORS,
  LOADING,
  LOGOUT,
} from '../types.js';

const AuthState = (props) => {
  //const [cookies, setCookie, removeCookie] = useCookies(['name']);
  const initialState = {
    //token: localStorage.getItem('token'),
    token: Cookies.get('token'),
    isAuthenticated: false,
    user: null,
    error: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // login user
  const login = async (emailOrAccount, password) => {
    dispatch({ type: LOADING });

    const data = { email: emailOrAccount, password };
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .post('/api/auth', data, options)
      .then((res) => {
        console.log('success: ', res.data);
        dispatch({ payload: res.data, type: LOGIN_SUCCESS });
      })
      .catch((err) => {
        console.log('Error:', err.response.data.msg);
        dispatch({ payload: err.response.data.msg, type: LOGIN_FAIL });
      });
    console.log(state);
  };

  const clearErrors = () => {
    dispatch({ type: CLEAR_ERRORS });
  };
  const googleLogin = (response) => {
    dispatch({ type: LOADING });
    const data = { token: response.credential };
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      axios
        .post('/api/auth/login-google', data, options)
        .then((res) => {
          dispatch({ payload: res.data, type: LOGIN_SUCCESS });
        })
        .catch((err) => {
          dispatch({ payload: err.response.data.msg, type: LOGIN_FAIL });
        });
    } catch (err) {
      dispatch({ payload: err.response.data.msg, type: LOGIN_FAIL });
    }
  };

  // load user
  const loadUser = () => {
    //if (localStorage.token) {
    if (Cookies.get('token')) {
      console.log('na so so call dem dey call me');
      //const token = localStorage.getItem('token');
      const token = Cookies.get('token');
      console.log(token);
      setHeaderToken(token);

      axios
        .get('/api/auth')
        .then((res) => {
          console.log(res.data);
          dispatch({ payload: res.data, type: USER_LOADED });
        })
        .catch((err) => {
          console.log(err);

          dispatch({ payload: err.response.data.msg, type: AUTH_ERROR });
          return;
        });
    }
  };

  const logout = () => {
    console.log('i got called');
    dispatch({ payload: 'User logged out succesfully', type: LOGOUT });
    console.log(state);
  };

  // register user
  const register = (data) => {
    dispatch({ type: LOADING });

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .post('/api/user', data, options)
      .then((res) => {
        alert('User created successfully. You will now be logged in.');
        dispatch({ payload: res.data, type: REGISTER_SUCCESS });
      })
      .catch((err) => {
        console.log('Error:', err.response.data.msg);
        dispatch({ payload: err.response.data.msg, type: REGISTER_FAIL });
      });
  };

  // logout user
  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        login,
        loadUser,
        googleLogin,
        clearErrors,
        logout,
        register,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthState;
