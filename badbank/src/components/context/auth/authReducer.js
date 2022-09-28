import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CLEAR_ERRORS,
  LOGOUT,
  LOADING,
} from '../types.js';
//import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
  //const [cookies, setCookie, removeCookie] = useCookies(['name']);

  switch (action.type) {
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case REGISTER_FAIL:
      console.log('a frenzy');
      // localStorage.removeItem('token');
      Cookies.remove('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        loading: false,
      };

    case LOGIN_SUCCESS:
      //localStorage.setItem('token', action.payload.token);
      console.log('successfully login');
      Cookies.set('token', action.payload.token);
      console.log(action.payload.token);
      console.log('reading...', Cookies.get('token'));
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        user: action.payload.user,
        msg: null,
        loading: false,
      };

    case REGISTER_SUCCESS:
      //localStorage.setItem('token', action.payload.token);
      Cookies.set('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        user: action.payload.user,
        msg: 'User created successfully',
        loading: false,
      };

    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
};
