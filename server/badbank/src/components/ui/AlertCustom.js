import React, { useContext } from 'react';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Alert';
import AlertContext from '../context/alert/alertContext';

const AlertCustom = () => {
  const alertContext = useContext(AlertContext);
  const top = window.screen.height - 450 + 'px';
  const left = window.innerWidth - 250 + 'px';
  return (
    alertContext.alerts.length > 0 &&
    alertContext.alerts.map((alert) => {
      return (
        <Alert style={{ top, left }} variant={alert.type} className='fade'>
          {alert.msg}
        </Alert>
      );
    })
  );
};
export default AlertCustom;
