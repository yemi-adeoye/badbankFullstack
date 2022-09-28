import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';

const SelectCustom = ({ label, onChange, options, value }) => {
  let slctOptions = Object.keys(options).map((key, count) => {
    return (
      <option value={key} key={'a-' + count}>
        {options[key]}
      </option>
    );
  });

  return (
    <Col
      xs={{ span: 12 }}
      sm={{ span: 12 }}
      md={{ span: 4, offset: 4 }}
      lg={{ span: 4 }}
    >
      <label htmlFor='slctAction'>{label}</label>
      <select
        name='slctAction'
        onChange={onChange}
        className='form-select'
        value={value}
      >
        {slctOptions}
      </select>
    </Col>
  );
};

SelectCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default SelectCustom;
