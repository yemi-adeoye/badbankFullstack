import GenericInput from './GenericInput';
import PasswordError from './PasswordError';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import GoogleLogin from './GoogleLogin';

const RegisterForm = ({
  fields,
  onChangeHandler,
  onSubmitHandler,
  values,
  errors,
  passwordError,
  firstLoad,
}) => {
  const inputs = fields.map((field, count) => {
    const readonly =
      field.name === 'accountNumber' || field.name === 'SSN'
        ? 'readonly'
        : false;
    return (
      <GenericInput
        type={field.type}
        fieldName={field.name}
        id={field.name}
        onChangeHandler={onChangeHandler}
        value={values[field.name]}
        label={field.label}
        key={count}
        error={errors[field.name]}
        readonly={readonly}
      />
    );
  });

  let disabled = true;
  if (Object.keys(errors).length === 0) {
    disabled = false;
  }

  if (firstLoad) {
    disabled = true;
  }

  return (
    <Card>
      <Card.Header>Create an Account</Card.Header>
      <Card.Body>
        <form onSubmit={onSubmitHandler} className='frmRegister'>
          {inputs}
          <PasswordError passwordError={passwordError} />
          <div className='span-2'></div>
          <input
            className='form-control btn btn-primary m-xs-d m-md-4'
            type='submit'
            value='CREATE ACCOUNT'
            disabled={disabled}
            onChange={onChangeHandler}
            style={{ width: '100%' }}
          />

          <div className='span-2 mx-4 text-center' style={{ width: '50%' }}>
            OR
          </div>
          <GoogleLogin
            classVal='form-control span-2 m-xs-d m-md-4'
            style={{ width: '50%' }}
            APP_ID='347436993648-tgdrqu1589ho2j2p1c6q30rb8r67253j.apps.googleusercontent.com'
          />
        </form>
      </Card.Body>
    </Card>
  );
};

RegisterForm.propTypes = {
  fields: PropTypes.array.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onSubmitHandler: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  passwordError: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
};
export default RegisterForm;
