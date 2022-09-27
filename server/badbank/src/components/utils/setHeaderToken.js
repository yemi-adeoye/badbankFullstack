import axios from 'axios';

const setHeaderToken = (token) => {
  if (token) {
    // set the token into axio's global header
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // delete x-auth-token key from axio's defauklt headers object
    delete axios.defaults.headers.common['x-auth-token'];
  }

  return <div></div>;
};
export default setHeaderToken;
