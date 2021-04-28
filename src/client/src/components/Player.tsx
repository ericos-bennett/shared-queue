import { useState, useEffect, useRef, useCallback } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { makeStyles } from "@material-ui/core/styles";
import Cookie from 'js-cookie';

import PlayerControls from './PlayerControls';
import { getCurrentTrackIndex, getPositionInPlaylist, seek } from '../helpers'
import { Track, PlayerProps, PlaybackStatus } from '../../types';

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

export default function Player({tracks, accessToken, socket, playlistId}: PlayerProps) {

  const playlist = useRef<string>(playlistId);
  const token = useRef<string>(accessToken);
  const webSocket = useRef<any>(socket);
  
  const [ready, setReady] = useState<boolean>(false);
  const [play, setPlay] = useState<boolean>(false)
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const classes = useStyles();
  
  const togglePlay = (play: boolean): void => setPlay(!play);
  const changeTrack = (trackId: string): void => setCurrentTrack(trackId);
  
  const setPlaybackStatus = (playbackStatus: PlaybackStatus): void => {
      console.log('Received peer playback', playbackStatus)
      setCurrentTrack(playbackStatus.currentTrack);
      setTimeout(() => {
        if (playbackStatus.progressMs) {
          seek(token.current, playbackStatus.progressMs + 1000)
          .then(() => {
              setPlay(playbackStatus.play);
            })
        }
      }, 1000)
  };

  const getPlaybackStatus = useCallback((): PlaybackStatus => {

    const getTrackProgress = (tracks: Track[], currentTrack: string, ready: boolean): number => {
      if (currentTrack && ready) {
        const slider = document.querySelector('[aria-label="slider handle"]');
        const percentProgress = +slider!.getAttribute("aria-valuenow")!;
        const durationMs = tracks.filter(track => track.id === currentTrack)[0].durationMs;
        const progressMs = Math.round(durationMs * percentProgress / 100)
        return progressMs;
      }
      return 0;
    };

    return {
      currentTrack,
      play,
      progressMs: getTrackProgress(tracks, currentTrack, ready)
    };
  }, [tracks, currentTrack, play, ready]);
  
  // If there is no current track, set it to the first in the playlist
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0].id);
    }
  }, [tracks, currentTrack]);

  // Set WS listeners for playback sync
  useEffect(() => {
    webSocket.current.on('playbackStatus', setPlaybackStatus);
    webSocket.current.on('togglePlay', togglePlay);
    webSocket.current.on('changeTrack', changeTrack);
  }, []);

  // When a peer joins the room, send them the current playback status
  useEffect(() => {
    webSocket.current.on('peerJoin', (username: string) => {
      console.log(`${username} joined the room!`);
      webSocket.current.emit('playbackStatus', playlist.current, getPlaybackStatus());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => webSocket.current.off('peerJoin');
  }, [getPlaybackStatus]);

  // When the player is ready, ask the room for the playback status
  useEffect(() => {
    if (ready) {
      webSocket.current.emit('join', playlist.current, Cookie.get('userId'));
    }
  }, [ready])

  const togglePlayHandler = (): void => {
    togglePlay(play);
    webSocket.current.emit('togglePlay', playlist.current, play);
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    let currentTrackIndex = getCurrentTrackIndex(tracks, currentTrack);
    const newTrackIndex = direction === 'prev' ? currentTrackIndex - 1 : currentTrackIndex + 1;
    const trackId = tracks[newTrackIndex].id

    changeTrack(trackId);
    webSocket.current.emit('changeTrack', playlist.current, trackId)
  };

  const spotifyCallback = (state: any) => {
    if (!ready && state.status === 'READY') setReady(true);
    if (play && state.type === 'track_update') setPlay(true);
    console.log(state);
  };

  return(
    <div className={classes.root}>
      <SpotifyPlayer
        autoPlay
        token={accessToken}
        uris={currentTrack && `spotify:track:${currentTrack}`}
        showSaveIcon
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
        positionInPlaylist = {getPositionInPlaylist(tracks, currentTrack)}
        play={play}
      />
    </div>
  )

};