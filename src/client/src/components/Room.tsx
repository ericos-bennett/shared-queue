import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:3000'

type RoomProps = {
  user: string
}

export default function Room({user}: RoomProps) {

  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState({name: ''});
  
  // Gets the playlist object if one exists
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/room/${id}`);
      setPlaylist(res.data.body);
    })();

  }, [id])


  // Establishes the WebSocket Connection
  useEffect(() => {
    
    const socket = io(ENDPOINT);
    socket.emit('join room', `${id}`);

    const listener = (data: string) => console.log(data);
    socket.on("data", listener);

    return () => {
      socket.off("data", listener);
    }

  }, [id]);

  const playlistCheck = (playlist: any) => {
    if (!playlist) {
      return <h1>404</h1>
    } else if (playlist.name !== '') {
      return (
          <h1>Welcome to room {playlist.name}!</h1>
          
        )
    }
  }

  return (
    <div>
      { playlistCheck(playlist) }
    </div>
  )

};