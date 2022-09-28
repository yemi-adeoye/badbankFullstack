import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { v4 as uuidv4 } from 'uuid';
import { useReducer } from 'react';

import { SET_ALERT, REMOVE_ALERT } from '../types.js';

function AlertState(props) {
  const initialState = [];
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // setAlert
  const setAlert = (type, msg, timeout = 5000) => {
    console.log('Being called from: ', this);
    const id = uuidv4();
    const payload = { type, msg, id };
    dispatch({ payload, type: SET_ALERT });

    setTimeout(() => {
      console.log('Being called from: ', this);
      dispatch({ payload: id, type: REMOVE_ALERT });
    }, timeout);
  };

  return (
    <AlertContext.Provider value={{ alerts: state, setAlert }}>
      {props.children}
    </AlertContext.Provider>
  );
}

export default AlertState;
