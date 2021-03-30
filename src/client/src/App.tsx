import axios from 'axios';

const hitBackend = async () => {
  const res = await axios.post('/api/room')
  console.log(res.data);
}

export default function App() {
  return (
    <div className="App">
      <button onClick={hitBackend}>Create a</button>
    </div>
  );
}
