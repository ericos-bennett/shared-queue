import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import io from "socket.io-client";

import Playlist from './Playlist';

const ENDPOINT = 'http://localhost:3000'

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(90deg, #2c5e92 0%, #552f6d 80%)'
  }
}));

type RoomProps = {
  user: string
}

export default function Room({user}: RoomProps) {

  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState({name: ''});
  const classes = useStyles();
  
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
      return <Playlist
        name={playlist.name}
        tracks={playlist.tracks.items}
      />
    }
  }

  return (
    <div className={classes.root}>
      { playlistCheck(playlist) }
    </div>
  )

};