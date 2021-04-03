import { useEffect } from 'react';
import { useParams } from 'react-router'
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:3000'

export default function Room() {

  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    
    const socket = io(ENDPOINT);
    socket.emit('join room', `${id}`);

    const listener = (data: string) => console.log(data);
    socket.on("data", listener);

    return () => {
      socket.off("data", listener);
    }

  }, [id]);


  return(
    <h1>Welcome to room {id}!</h1>
  )
};