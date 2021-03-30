import axios from 'axios';

const userAuthRedirect = async () => {
  const res = await axios.post('/api/room')
  window.location.href = res.data;
}

export default function App() {
  return (
    <div className="App">
      <button onClick={userAuthRedirect}>Create a Room</button>
    </div>
  );
}
