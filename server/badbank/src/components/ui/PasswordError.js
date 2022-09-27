import PropTypes from 'prop-types';
import { Fragment } from 'react';

const PasswordError = ({ passwordError }) => {
  const {
    containsDigit,
    containsUpperCase,
    containsLowerCase,
    containsSpecialXter,
    meetsLengthReq,
  } = passwordError;

  const successIcon = (
    <Fragment>
      <i className='fas fa-times-circle'> </i>
    </Fragment>
  );
  const errorIcon = (
    <Fragment>
      <i className='fas fa-check-circle'> </i>
    </Fragment>
  );
  return (
    <div className='span-2 m-xs-d m-md-4'>
      <span className='pwrdError'>
        {containsDigit ? errorIcon : successIcon}
        Password must contain one or more digits
      </span>
      <span className='pwrdError'>
        {containsUpperCase ? errorIcon : successIcon}
        Password must contain one or more Uppercase character
      </span>
      <span className='pwrdError'>
        {containsLowerCase ? errorIcon : successIcon}
        Password must contain one or more lowercase character
      </span>
      <span className='pwrdError'>
        {containsSpecialXter ? errorIcon : successIcon}
        Password must contain one or more of: @ . + $ = * () {} _ - \ /
      </span>
      <span className='pwrdError'>
        {meetsLengthReq ? errorIcon : successIcon}
        Password must have at least eight(8) characters
      </span>
    </div>
  );
};

PasswordError.propTypes = {
  passwordError: PropTypes.object.isRequired,
};

export default PasswordError;
