import { useState, useEffect, useCallback } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { makeStyles } from "@material-ui/core/styles";

import PlayerControls from './PlayerControls';
import { Track } from '../../types';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    '& button': {
      outline: 'none'
    }
  }
}));

type PlayerProps = {
  accessToken: string,
  tracks: Track[],
  webSocket: any,
  playlistId: string
}

export default function Player({accessToken, tracks, webSocket, playlistId}: PlayerProps) {

  const [play, setPlay] = useState(false)
  const classes = useStyles();
  
  const togglePlay = useCallback((isPlaying: boolean): void => {
    // Toggles play prop for SpotifyPlayer
    setPlay(isPlaying);
  }, []);
  
  useEffect(() => {
    webSocket.current.on('togglePlay', togglePlay);
  }, [webSocket, togglePlay])

  const togglePlayHandler = (): void => {
    // Calls togglePlay
    togglePlay(!play);
    // Send togglePlay message via WS
    webSocket.current!.emit('togglePlay', playlistId, !play);
  };

  return(
    <div className={classes.root}>
      <SpotifyPlayer
        token={accessToken}
        uris={tracks.map(track => `spotify:track:${track.id}`)}
        showSaveIcon={true}
        name="Spotify Mix"
        callback={state => setPlay(state.isPlaying)}
        play={play}
        styles={{
          height: 80,
        }}
      />
      <PlayerControls 
        togglePlayHandler={togglePlayHandler}
      />
    </div>
  )

};