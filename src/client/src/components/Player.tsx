import { useState, useEffect, useCallback } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

import PlayerControls from './PlayerControls';
import { PlayerProps, PlaybackStatus } from '../../types';

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

export default function Player({accessToken, tracks, webSocket, playlistId}: PlayerProps) {

  const [active, setActive] = useState(false);
  const [play, setPlay] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | undefined>();
  const classes = useStyles();
  
  const togglePlay = (isPlaying: boolean): void => setPlay(isPlaying);
  const changeTrack = (trackId: string): void => setCurrentTrack(trackId);

  const getTrackProgress = useCallback((): number => {
    if (active) {
      const slider = document.querySelector('[aria-label="slider handle"]');
      const percentProgress = +slider!.getAttribute("aria-valuenow")!;
      const durationMs = tracks.filter(track => track.id === currentTrack)[0].durationMs;
      const progressMs = Math.round(durationMs * percentProgress / 100)
      return progressMs;
    }
    return 0;
  }, [active, currentTrack, tracks]);

  const getPlaybackStatus = useCallback((): PlaybackStatus => {
    const playbackStatus = {
      currentTrack,
      isPlaying: play,
      progressMs: getTrackProgress()
    };
    return playbackStatus;
  }, [currentTrack, getTrackProgress, play]);
  
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0].id);
    }
  }, [tracks, currentTrack]);

  useEffect(() => {
    const socket = webSocket.current;
    socket.on('togglePlay', togglePlay);
    socket.on('changeTrack', changeTrack);
    socket.on('peerJoin', (username: string) => {
      console.log(`${username} joined the room!`);
      socket.emit('playbackStatus', playlistId, getPlaybackStatus());
    });

    return () => {
      socket.off('togglePlay');
      socket.off('changeTrack');
      socket.off('peerJoin');
    }
  }, [webSocket, playlistId, getPlaybackStatus]);

  const getCurrentTrackIndex = (): number => {
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].id === currentTrack) return i;
    }
    return -1;
  };

  const togglePlayHandler = (): void => {
    togglePlay(!play);
    webSocket.current.emit('togglePlay', playlistId, !play);
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    let currentTrackIndex = getCurrentTrackIndex();
    const newTrackIndex = direction === 'prev' ? currentTrackIndex - 1 : currentTrackIndex + 1;
    if (tracks[newTrackIndex]) {
      const trackId = tracks[newTrackIndex].id
      changeTrack(trackId);
      webSocket.current.emit('changeTrack', playlistId, trackId)
    }
  };

  const getPositionInPlaylist = (): 'only' | 'start' | 'middle' | 'end' | 'deleted' => {
    if (getCurrentTrackIndex() === -1) return 'deleted';
    if (getCurrentTrackIndex() === 0 && tracks.length === 1) return 'only';
    if (getCurrentTrackIndex() === 0) return 'start';
    if (getCurrentTrackIndex() === tracks.length - 1) return 'end';
    return 'middle';
  };

  const spotifyCallback = (state: any) => {
    setPlay(state.isPlaying);
    if (!active && state.type === 'player_update') setActive(true);
  };

  return(
    <div className={classes.root}>
      <Button onClick={getPlaybackStatus}>LOG</Button>
      <SpotifyPlayer
        token={accessToken}
        uris={`spotify:track:${currentTrack}`}
        showSaveIcon={true}
        name="Spotify Mix"
        callback={spotifyCallback}
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