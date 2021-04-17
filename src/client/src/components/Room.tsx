import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router';
import { makeStyles } from "@material-ui/core/styles";
import { Container } from '@material-ui/core';

import Cookie from 'js-cookie';
import axios from 'axios';
import io from "socket.io-client";

import Playlist from './Playlist';
import Search from './Search';
import Player from './Player';

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
  }
}));

type RoomProps = {
  user: string
}

type RoomParams = {
  id: string
}

type trackType = {
  artist: string,
  title: string,
  uri: string,
  albumUrl: string
}

type PlaylistType = SpotifyApi.SinglePlaylistResponse | null | undefined;
type SearchTracksType = SpotifyApi.TrackObjectFull[] | null | undefined;

export default function Room({user}: RoomProps) {

  const [playlist, setPlaylist] = useState<PlaylistType>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const { id } = useParams<RoomParams>();
  const classes = useStyles();
  
  const deleteTrack = useCallback((index: number) => {

    // @ts-ignore - fix this!
    setPlaylist((prev: SpotifyApi.SinglePlaylistResponse): SpotifyApi.SinglePlaylistResponse => {
      
      //Remove the track in local state
      let playlistClone = { ...prev };
      const tracks = playlistClone.tracks.items;
      tracks?.splice(index, 1);
      playlistClone.tracks.items = tracks;
      
      // If you are the playlist owner, also delete the track on Spotify's DB
      if (Cookie.get('userId') === prev.owner.id) {
        axios.delete(`${ENDPOINT}/api/room/${prev.id}/${index}`, 
          { data: { snapshotId: prev.snapshot_id }}
        ).then(res => playlistClone.snapshot_id = res.data.body.snapshot_id)
        .catch(err => console.log(err));
      }

      return playlistClone;
    });
  }, []);

  const addTrack = useCallback((track: trackType) => {
    
    // @ts-ignore - fix this!
    setPlaylist((prev: SpotifyApi.SinglePlaylistResponse): SpotifyApi.SinglePlaylistResponse => {
      
      const playlistClone = { ...prev };
      const tracks = playlistClone.tracks.items;
      // @ts-ignore - fix this!
      tracks.push({ track })
      playlistClone.tracks.items = tracks;
      
      // If you are the playlist owner, add the track to it on Spotify's DB
      if (Cookie.get('userId') === prev.owner.id) {
        axios.put(`${ENDPOINT}/api/room/${prev.id}`, { trackId: track.uri })
          .then(res => playlistClone.snapshot_id = res.data.body.snapshot_id)
          .catch(err => console.log(err));
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
      
      socket.on('delete', deleteTrack);
      socket.on('add', addTrack);
      
      setPlaylist(spotifyResponse);
      setSocket(socket);
      
      return () => socket.disconnect();
    })();
  }, [id, deleteTrack, addTrack])


  const deleteTrackHandler = (index: number): void => {
    deleteTrack(index);
    // Delete the track for all peers in the same WS room
    socket!.emit('delete', playlist!.id, index);
  };

  const addTrackHandler = (track: trackType): void => {
    addTrack(track);
    // Send the new track to all peers in the same WS room COME BACK TO REFACTOR!
    socket!.emit('add', playlist!.id, track);
  };

  if (playlist === null) {
    return <Container className={classes.root}>404</Container>
  } else if (playlist) {
    return (
      <div className={classes.root}>
        <Container>
          <h1 className={classes.title}>Welcome to room {playlist.name}!</h1>
          <Search
            addTrackHandler={addTrackHandler}
            accessToken={Cookie.get('accessToken')!}
          />
          <Playlist
            tracks={playlist.tracks.items}
            deleteTrackHandler={deleteTrackHandler}
          />
        </Container>
        <Player
          tracks={playlist.tracks.items}
          accessToken={Cookie.get('accessToken')!}
        />
      </div>
    )
  } else {
    return (
      <Container className={classes.root}>
        <div></div>
      </Container>
    )
  }

};
