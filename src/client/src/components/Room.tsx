import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from "@material-ui/core/styles";
import Cookie from 'js-cookie';
import axios from 'axios';
import io from "socket.io-client";

import Playlist from './Playlist';
import Search from './Search'

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
  },
  title: {
    textAlign: 'center'
  }
}));

type RoomProps = {
  user: string
}

type RoomParams = {
  id: string
}

type PlaylistType = SpotifyApi.SinglePlaylistResponse | null | undefined;

export default function Room({user}: RoomProps) {

  const { id } = useParams<RoomParams>();
  const [playlist, setPlaylist] = useState<PlaylistType>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const classes = useStyles();


  const deleteTrack = useCallback((index: number) => {
    
    // @ts-ignore - fix this!
    setPlaylist((prev: SpotifyApi.SinglePlaylistResponse): SpotifyApi.SinglePlaylistResponse => {
      console.log(prev);
      const playlistClone = { ...prev };
      console.log(playlistClone);
      const tracks = playlistClone.tracks.items;
      tracks?.splice(index, 1);
      playlistClone.tracks.items = tracks;
      
      // If you are the playlist owner, delete the track on Spotify's DB
      if (Cookie.get('userId') === prev.owner.id) {
        console.log('test');
        axios.delete(`${ENDPOINT}/api/room/${prev.id}/${index}`, 
          { data: { snapshotId: prev.snapshot_id }}
        );
      }

      return playlistClone;

    });

  }, [])

  useEffect(() => {
    (async () => {
      // Gets the playlist object if one exists
      const res = await axios.get(`/api/room/${id}`);
      const spotifyResponse: SpotifyApi.SinglePlaylistResponse = res.data.body;

      // Initiate the websocket and add its listeners
      const socket = io(ENDPOINT);
      socket.emit('join', `${id}`);

      const listener = (data: string) => console.log(data);
      socket.on("data", listener);
      
      socket.on('delete', deleteTrack);
      
      setPlaylist(spotifyResponse);
      setSocket(socket);
      
      return () => {
        socket.disconnect();
      }

    })();

  }, [id, deleteTrack])


  const deleteTrackHandler = (index: number): void => {
    deleteTrack(index);
    // Delete the track for all peers in the same WS room
    socket!.emit('delete', playlist!.id, index);
  };

  const addTrackHandler = (id: string): void => {

  };

  const searchHandler = (query: string): void => {
    console.log('searched for', query);
  };

  if (playlist === null) {
    return <h1>404</h1>
  } else if (playlist) {
    return (
      <div className={classes.root}>
        <h1 className={classes.title}>Welcome to room {playlist.name}!</h1>
      <Search
          addTrackHandler={addTrackHandler}
          searchHandler={searchHandler}
        />
        <Playlist
          tracks={playlist.tracks.items}
          deleteTrackHandler={deleteTrackHandler}
        />
      </div>
    )
  } else {
    return <div></div>
  }

};
