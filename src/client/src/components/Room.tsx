import { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router';
import { makeStyles } from "@material-ui/core/styles";
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Cookie from 'js-cookie';
import io from "socket.io-client";

import Playlist from './Playlist';
import Search from './Search';
import Player from './Player';
import usePlaylist from '../hooks/usePlaylist';
import { Track } from '../../types'

const ENDPOINT = 'http://localhost:3000'

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#CDCDCD'
  },
  title: {
    textAlign: 'center'
  },
  invalidId: {
    textAlign: 'center',
  }
}));

export default function Room() {

  const [searchTracks, setSearchTracks] = useState<Track[]>([]);
  const webSocket = useRef<SocketIOClient.Socket | null>(null);
  const { playlist, addTrack, deleteTrack } = usePlaylist();
  const { id } = useParams<{id: string}>();
  const history = useHistory();
  const classes = useStyles();
  
  // Initiate the websocket and add its listeners
  useEffect(() => {

    const socket = io(ENDPOINT);
    socket.emit('join', `${id}`, Cookie.get('userId'));
    socket.on('peerJoin', (message: string) => console.log(message))
    
    socket.on('delete', deleteTrack);
    socket.on('add', addTrack);

    webSocket.current = socket;

    return () => {
      webSocket.current!.disconnect()
    };
  }, [id, addTrack, deleteTrack])

  const deleteTrackHandler = (index: number): void => {
    deleteTrack(index);
    // Delete the track for all peers in the same WS room
    webSocket.current!.emit('delete', playlist!.id, index);
  };

  const addTrackHandler = (track: Track): void => {
    addTrack(track);
    // Send the new track to all peers in the same WS room
    webSocket.current!.emit('add', playlist!.id, track);
  };

  let content;
  if (playlist === null) {
    content = (
      <div className={classes.invalidId}>
        <h1>404</h1>
        <p>Room ID doesn't match any Spotify playlists</p>
        <Button
          variant="contained"
          onClick={() => history.push('/')}
        >
          Take me Home
        </Button>
      </div>
    )
  } else if (playlist) {
    content = (
      <div>
        <Container>
          <h1 className={classes.title}>{playlist.name}</h1>
          <Search
            addTrackHandler={addTrackHandler}
            searchTracks={searchTracks}
            setSearchTracks={setSearchTracks}
            accessToken={Cookie.get('accessToken')!}
          />
          {searchTracks.length === 0 &&
          <Playlist
            tracks={playlist.tracks}
            deleteTrackHandler={deleteTrackHandler}
          />
          }
        </Container>
        <Player
          tracks={playlist.tracks}
          accessToken={Cookie.get('accessToken')!}
        />
      </div>
    )
  }

  return <div className={classes.root}>{content}</div>

};
