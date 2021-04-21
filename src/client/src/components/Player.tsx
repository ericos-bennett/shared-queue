import { useState, useEffect } from 'react';
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
  const [currentTrack, setCurrentTrack] = useState<string | undefined>();
  const classes = useStyles();
  
  const togglePlay = (isPlaying: boolean): void => setPlay(isPlaying);
  const changeTrack = (trackId: string): void => setCurrentTrack(trackId);
  
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0].id)
    }
  }, [tracks, currentTrack])

  useEffect(() => {
    webSocket.current.on('togglePlay', togglePlay);
    webSocket.current.on('changeTrack', changeTrack);
  }, [webSocket])

  const getCurrentTrackIndex = (): number => {
    let currentTrackIndex = -1;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].id === currentTrack) currentTrackIndex = i;
    }
    return currentTrackIndex;
  }

  const togglePlayHandler = (): void => {
    togglePlay(!play);
    webSocket.current!.emit('togglePlay', playlistId, !play);
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    let currentTrackIndex = getCurrentTrackIndex();
    const newTrackIndex = direction === 'prev' ? currentTrackIndex - 1 : currentTrackIndex + 1;
    if (tracks[newTrackIndex]) {
      const trackId = tracks[newTrackIndex].id
      changeTrack(trackId);
      webSocket.current!.emit('changeTrack', playlistId, trackId)
    }
  }

  const getPositionInPlaylist = (): 'only' | 'start' | 'middle' | 'end' => {
    if (getCurrentTrackIndex() === 0 && tracks.length === 1) return 'only';
    if (getCurrentTrackIndex() === 0) return 'start';
    if (getCurrentTrackIndex() === tracks.length - 1) return 'end';
    return 'middle';
  }

  return(
    <div className={classes.root}>
      <SpotifyPlayer
        token={accessToken}
        uris={`spotify:track:${currentTrack}`}
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
        changeTrackHandler={changeTrackHandler}
        positionInPlaylist = {getPositionInPlaylist()}
        isPlaying={play}
      />
    </div>
  )

};