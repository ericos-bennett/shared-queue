import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import { makeStyles } from "@material-ui/core/styles";
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

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
  },
  invalidId: {
    textAlign: 'center',
  }
}));

type Track = {
  artist: string,
  title: string,
  id: string,
  albumUrl: string
}

type PlaylistType = {
  name: string,
  id: string,
  owner: string,
  snapshotId: string,
  tracks: Track[]
}

export default function Room() {

  const [playlist, setPlaylist] = useState<PlaylistType | null>();
  const [searchTracks, setSearchTracks] = useState<Track[]>([]);
  const webSocket = useRef<SocketIOClient.Socket | null>(null);
  const { id } = useParams<{id: string}>();
  const history = useHistory();
  const classes = useStyles();
  
  const deleteTrack = useCallback((index: number) => {

    // @ts-ignore - fix this!
    setPlaylist((prev: PlaylistType): PlaylistType => {
      
      // Remove the track in local state
      let playlistClone = { ...prev };
      const tracks = [ ...playlistClone.tracks ];
      tracks?.splice(index, 1);
      playlistClone.tracks = tracks;
      
      // If you are the playlist owner, also delete the track on Spotify's DB
      if (Cookie.get('userId') === prev.owner) {
        axios.delete(`${ENDPOINT}/api/room/${prev.id}/${index}`, 
          { data: { snapshotId: prev.snapshotId }}
        ).then(res => playlistClone.snapshotId = res.data.body.snapshot_id)
        .catch(err => console.log(err));
      }

      return playlistClone;
    });
  }, []);

  const addTrack = useCallback((track: Track): void => {
    
    // @ts-ignore - fix this!
    setPlaylist((prev: PlaylistType): PlaylistType => {

      // Add the track in local state
      const playlistClone = { ...prev };
      const tracks = [ ...playlistClone.tracks ];
      tracks.push(track);
      playlistClone.tracks = tracks;
      
      // If you are the playlist owner, add the track to it on Spotify's DB
      if (Cookie.get('userId') === prev.owner) {
        axios.put(`${ENDPOINT}/api/room/${prev.id}`, { trackId: track.id })
          .then(res => playlistClone.snapshotId = res.data.body.snapshot_id)
          .catch(err => console.log(err));
      }
      
      return playlistClone;
    });
  }, [])

  // Gets the playlist object if the user is signed in and one exists
  useEffect(() => {
    if (!Cookie.get('userId')) {
      history.push('/')
    } else {
      (async () => {
        const res = await axios.get(`/api/room/${id}`);
        const spotifyResponse: SpotifyApi.SinglePlaylistResponse = res.data.body;
        
        const playlist = !res.data.body ? null : {
          name: spotifyResponse.name,
          id: spotifyResponse.id,
          owner: spotifyResponse.owner.id,
          snapshotId: spotifyResponse.snapshot_id,
          tracks: spotifyResponse.tracks.items.map(track => {
            return {
              artist: track.track.artists[0].name,
              title: track.track.name,
              id: track.track.id,
              albumUrl: track.track.album.images[2].url
            }
          })
        };
  
        setPlaylist(playlist);

      })();
    }
  }, [id, history])

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
