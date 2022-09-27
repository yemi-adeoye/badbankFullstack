import PropTypes from 'prop-types';

const GenericInput = ({
  type,
  fieldName,
  onChangeHandler,
  error,
  value,
  label,
  ...rest
}) => {
  return (
    <div className='group m-xs-4 m-md-4'>
      <span className='error'> {error} </span>
      <label htmlFor={fieldName} className='form-control'>
        {label}
      </label>
      <input
        type={type}
        name={fieldName}
        id={fieldName}
        onChange={onChangeHandler}
        value={value}
        className='form-control'
        {...rest}
      />
    </div>
  );
};

GenericInput.propTypes = {
  type: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  error: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
};

export default GenericInput;
