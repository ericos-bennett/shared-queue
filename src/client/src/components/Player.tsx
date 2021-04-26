import { useState, useEffect, useCallback } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { makeStyles } from "@material-ui/core/styles";
import Cookie from 'js-cookie';

import PlayerControls from './PlayerControls';
import { PlayerProps, PlaybackStatus, PlaylistPositions } from '../../types';

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

export default function Player({accessToken, tracks, socket, playlistId}: PlayerProps) {

  const [ready, setReady] = useState<boolean>(false);
  const [play, setPlay] = useState<boolean>(false)
  const [currentTrack, setCurrentTrack] = useState<string | undefined>();
  const classes = useStyles();
  
  const togglePlay = (play: boolean): void => setPlay(!play);
  const changeTrack = (trackId: string): void => setCurrentTrack(trackId);

  const setPlayback = (playbackStatus: PlaybackStatus): void => {
      console.log('ready!')
      console.log(playbackStatus)
      setCurrentTrack(playbackStatus.currentTrack);
      if (playbackStatus.play) setPlay(true);
  };

  const getTrackProgress = useCallback((): number => {
    if (ready) {
      const slider = document.querySelector('[aria-label="slider handle"]');
      const percentProgress = +slider!.getAttribute("aria-valuenow")!;
      const durationMs = tracks.filter(track => track.id === currentTrack)[0].durationMs;
      const progressMs = Math.round(durationMs * percentProgress / 100)
      return progressMs;
    }
    return 0;
  }, [ready, currentTrack, tracks]);

  const getPlaybackStatus = useCallback((): PlaybackStatus => {
    return {
      currentTrack,
      play,
      progressMs: getTrackProgress()
    };
  }, [currentTrack, play, getTrackProgress]);
  
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0].id);
    }
  }, [tracks, currentTrack]);

  useEffect(() => {
    socket.on('playbackStatus', setPlayback);
    socket.on('togglePlay', togglePlay);
    socket.on('changeTrack', changeTrack);
    socket.on('peerJoin', (username: string) => {
      console.log(`${username} joined the room!`);
      socket.emit('playbackStatus', playlistId, getPlaybackStatus());
    });

    return () => {
      socket.off('playbackStatus');
      socket.off('togglePlay');
      socket.off('changeTrack');
      socket.off('peerJoin');
    }
  }, [socket, playlistId, getPlaybackStatus]);

  useEffect(() => {
    if (ready) socket.emit('join', playlistId, Cookie.get('userId'));
  }, [ready, socket, playlistId])

  const getCurrentTrackIndex = (): number => {
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].id === currentTrack) return i;
    }
    return -1;
  };

  const togglePlayHandler = (): void => {
    togglePlay(play);
    socket.emit('togglePlay', playlistId, play);
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    let currentTrackIndex = getCurrentTrackIndex();
    const newTrackIndex = direction === 'prev' ? currentTrackIndex - 1 : currentTrackIndex + 1;
    if (tracks[newTrackIndex]) {
      const trackId = tracks[newTrackIndex].id
      changeTrack(trackId);
      socket.emit('changeTrack', playlistId, trackId)
    }
  };

  const getPositionInPlaylist = (): PlaylistPositions => {
    if (getCurrentTrackIndex() === -1) return 'deleted';
    if (getCurrentTrackIndex() === 0 && tracks.length === 1) return 'only';
    if (getCurrentTrackIndex() === 0) return 'start';
    if (getCurrentTrackIndex() === tracks.length - 1) return 'end';
    return 'middle';
  };

  const spotifyCallback = (state: any) => {
    // setPlay(state.play);
    if (!ready && state.status === 'READY') setReady(true);
    if (play && state.type === 'track_update') setPlay(true);

    console.log(state);
  };

  return(
    <div className={classes.root}>
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
        play={play}
      />
    </div>
  )

};