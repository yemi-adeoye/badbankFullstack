import { useEffect, useContext } from 'react';
import authContext from '../context/auth/authContext';
import accountContext from '../context/account/accountContext';
import transactionContext from '../context/transaction/transactionContext';

import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Col from 'react-bootstrap/Col';
import happyPeople from '../../images/happy-people.jpg';
import internet from '../../images/internet.jpg';
import moneyGrow from '../../images/moneyGrow.jpg';
import Cookies from 'js-cookie';

const Home = () => {
  const { loadUser, isAuthenticated } = useContext(authContext);
  const { getAccounts } = useContext(accountContext);
  const { getTransactions } = useContext(transactionContext);
  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
      getAccounts();
      getTransactions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  return (
    <Row className='m-0'>
      <Col
        xs={{ span: 12 }}
        sm={{ span: 12 }}
        md={{ span: 10, offset: 1 }}
        lg={{ span: 10, offset: 1 }}
      >
        <Card>
          <Card.Header>Welcome to BadBank</Card.Header>
          <Card.Body>
            <Card.Text>
              At badbank we provide excellent services to cater for your needs.
              We have the best savings and checking accounts in the country. We
              also have a smooth and personal internet banking platform so you
              can bank from anywhere. Access your funds 247 and carry out
              transactions at your convenience. What are you waiting for?
            </Card.Text>
            <Link to='/register' className='btn btn-secondary mb-2'>
              Join Badbank today!
            </Link>

            <Carousel fade variant='dark'>
              <Carousel.Item>
                <img
                  className='d-block w-100'
                  src={happyPeople}
                  alt='Happy colleagues at work'
                />
                <Carousel.Caption
                  className='lint'
                  style={{ color: 'rgb(255, 255, 255)' }}
                >
                  <h3>Excellent Work Force</h3>
                  <p>At Badbank we employ the very best!</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className='d-block w-100'
                  src={moneyGrow}
                  alt='shows the earth connected by internet'
                />

                <Carousel.Caption
                  className='lint'
                  style={{ color: 'rgb(255, 255, 255)' }}
                >
                  <h3>Best interest rate in the country</h3>
                  <p>
                    Watch your money grow as we provide the best interest rate
                    for your savings account
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className='d-block w-100'
                  src={internet}
                  alt='shows the world connected by internet'
                />

                <Carousel.Caption
                  className='lint'
                  style={{ color: 'rgb(255, 255, 255)' }}
                >
                  <h3>Internet Banking</h3>
                  <p>Transfer funds to friends and family in no time</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default Home;
