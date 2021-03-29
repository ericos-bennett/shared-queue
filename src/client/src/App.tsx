import axios from 'axios';

const hitBackend = async () => {
  const res = await axios.get('/test')
  console.log(res.data);
}

export default function App() {
  return (
    <div className="App">
      <button onClick={hitBackend}>Send request</button>
    </div>
  );
}
