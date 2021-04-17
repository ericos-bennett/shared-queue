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

export default function Room({user}: RoomProps) {

  const [playlist, setPlaylist] = useState<PlaylistType | null>();
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [searchTracks, setSearchTracks] = useState<Track[]>([]);
  const { id } = useParams<RoomParams>();
  const classes = useStyles();
  
  const deleteTrack = useCallback((index: number) => {

    // @ts-ignore - fix this!
    setPlaylist((prev: PlaylistType): PlaylistType => {
      
      //Remove the track in local state
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
      setSocket(socket);
      
      return () => socket.disconnect();
    })();
  }, [id, deleteTrack, addTrack])


  const deleteTrackHandler = (index: number): void => {
    deleteTrack(index);
    // Delete the track for all peers in the same WS room
    socket!.emit('delete', playlist!.id, index);
  };

  const addTrackHandler = (track: Track): void => {
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
  } else {
    return (
      <Container className={classes.root}>
        <div></div>
      </Container>
    )
  }

};
