import axios from 'axios';

const userAuthRedirect = async () => {
  const res = await axios.get('/api/auth/code');
  window.location.href = res.data;
}

const createPlaylist = async () => {
  const res = await axios.post('/api/playlist', {name: 'abc'});
  console.log(res);
}

export default function App() {
  return (
    <div className="App">
      <button onClick={userAuthRedirect}>Sign In</button>
      <button onClick={createPlaylist}>Create Playlist</button>

    </div>
  );
}
