import { Fragment, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { MIN_PASSWORD_LENGTH, FIELDS } from './constants';
import RegisterForm from '../ui/RegisterForm';
import faker from 'faker';
import axios from 'axios';
import authContext from '../context/auth/authContext';
import alertContext from '../context/alert/alertContext';

const Register = (props) => {
  const AlertContext = useContext(alertContext);
  const AuthContext = useContext(authContext);
  const { isAuthenticated, error, loadUser, loading, clearErrors, register } =
    AuthContext;
  const { setAlert } = AlertContext;
  // set the initital password error states
  const [passwordValidation, setPasswordValidation] = useState({
    containsDigit: false,
    containsUpperCase: false,
    containsLowerCase: false,
    containsSpecialXter: false,
    meetsLengthReq: false,
  });

  const resetPasswordErrorToDefault = (props) => {
    const defaultPassword = {
      containsDigit: false,
      containsUpperCase: false,
      containsLowerCase: false,
      containsSpecialXter: false,
      meetsLengthReq: false,
    };

    setPasswordValidation({ ...passwordValidation, ...defaultPassword });
  };

  const [firstLoad, setFirstLoad] = useState(true);

  const formik = useFormik({
    initialValues: {
      fName: '',
      lName: '',
      email: '',
      password: '',
      passwordAgain: '',
      accountType: 'Savings',
      dob: '2000-01-01',
      accountNumber: faker.finance.account(),
      SSN: faker.finance.account() + '12',
    },
    onSubmit: (values) => {
      const account = {
        accountNumber: values.accountNumber,
        accountType: values.accountType,
      };
      let body = {
        fName: values.fName,
        lName: values.lName,
        email: values.email.toLowerCase(),
        dob: values.dob,
        SSN: values.SSN,
        role: 'user',
        password: values.password,
        account,
      };

      register(body);

      values.fName = '';
      values.lName = '';
      values.email = '';
      values.password = '';
      values.passwordAgain = '';

      resetPasswordErrorToDefault();
    },
    validate: (values) => {
      let errors = {};

      setFirstLoad(false);

      // validate the user's firstname
      if (!values.fName) {
        errors.fName = 'Field required';
      } else if (!/[a-zA-Z]{2,}/.test(values.fName)) {
        errors.fName = 'Enter a valid name';
      }

      // validate the user's lastname
      if (!values.lName) {
        errors.lName = 'Field required';
      } else if (!/[a-zA-Z]{2,}/.test(values.lName)) {
        errors.lName = 'Enter a valid name';
      }

      // validate the user's email
      if (!values.email) {
        errors.email = 'Field Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      }

      if (!values.password) {
        errors.password = 'Field Required';
        resetPasswordErrorToDefault();
      } else {
        const containsDigit = /\d+/.test(values.password) ? true : false;

        const containsUpperCase = /[A-Z]+/.test(values.password) ? true : false;

        const containsLowerCase = /[a-z]+/.test(values.password) ? true : false;

        const containsSpecialXter = /[@.+=$*\\/)(}{_-]+/.test(values.password)
          ? true
          : false;

        const meetsLengthReq =
          values.password.length >= MIN_PASSWORD_LENGTH ? true : false;

        setPasswordValidation({
          ...passwordValidation,
          containsDigit,
          containsLowerCase,
          containsUpperCase,
          containsSpecialXter,
          meetsLengthReq,
        });
      }

      if (!values.passwordAgain) {
        errors.txtPasswordAgain = 'Field Required';
      } else if (values.password !== values.passwordAgain) {
        errors.passwordAgain = 'Passwords must match';
      }
      return errors;
    },
  });
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    if (error) {
      console.log(error);
      setAlert('danger', error);
      clearErrors();
    }
  });

  return (
    <Fragment>
      <RegisterForm
        fields={FIELDS}
        onChangeHandler={formik.handleChange}
        onSubmitHandler={formik.handleSubmit}
        values={formik.values}
        errors={formik.errors}
        passwordError={passwordValidation}
        firstLoad={firstLoad}
      />
    </Fragment>
  );
};
export default Register;
