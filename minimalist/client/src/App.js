import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const learn = () => {
    axios
      .get('/login')
      .then((res) => {
        console.log(res.data);
      })
      .catch({});
  };
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <btn onClick={learn}>Learn React</btn>
      </header>
    </div>
  );
}

export default App;
