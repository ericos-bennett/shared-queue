import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const hitBackend = () => {
  axios.get('/test')
  .then((response) => {
  console.log(response.data)
  })
  }

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={hitBackend}>Send request</button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
