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
  const classes = useStyles();
  
  // Gets the playlist object if one exists
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/room/${id}`);
      const spotifyResponse: SpotifyApi.SinglePlaylistResponse = res.data.body;
      setPlaylist(spotifyResponse);
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

  const deleteTrack = async (playlistId: string, index: number, snapshotId: string): Promise<void> => {

    const res = await axios.delete(`${ENDPOINT}/api/room/${playlistId}/${index}`, 
      { data: { snapshotId }}
    );

    const playlistClone = { ...playlist };
    const tracks = playlistClone.tracks!.items;
    tracks?.splice(index, 1);
    playlistClone.tracks!.items = tracks;
    // @ts-ignore - fix this!
    setPlaylist(playlistClone);
  };

  const playlistCheck = (playlist: PlaylistType) => {
    if (playlist === null) {
      return <h1>404</h1>
    } else if (playlist) {
      return (
        <div>
          <h1 className={classes.title}>Welcome to room {playlist.name}!</h1>
          <Playlist
            playlistId={playlist.id}
            snapshotId={playlist.snapshot_id}
            tracks={playlist.tracks.items}
            deleteTrack={deleteTrack}
          />
        </div>
      )
    }
  }


  return (
    <div className={classes.root}>
      { playlistCheck(playlist) }
    </div>
  )

};
