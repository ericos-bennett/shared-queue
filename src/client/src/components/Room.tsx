import { useState, useEffect } from 'react';
import { useParams } from 'react-router'
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:3000'

export default function Room() {

  // const [response, setResponse] = useState("");
  
  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.emit('message', 'client says hi!');
  }, []);

  let { id } = useParams<{ id: string }>();

  return(
    <h1>Welcome to room {id}!</h1>
  )
};