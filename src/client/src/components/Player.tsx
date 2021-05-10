import { useState, useEffect, useRef } from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import { makeStyles } from '@material-ui/core/styles';

import PlayerControls from './PlayerControls';
import { getCurrentTrackIndex, getPositionInPlaylist } from '../helpers';
import { PlayerProps } from '../../types';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    '& button': {
      outline: 'none',
    },
  },
}));

export default function Player({ tracks, accessToken, socket, playlistId }: PlayerProps) {
  const playlist = useRef<string>(playlistId);
  const webSocket = useRef<any>(socket);

  const [play, setPlay] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const classes = useStyles();

  const togglePlay = (play: boolean): void => setPlay(!play);
  const changeTrack = (trackId: string): void => setCurrentTrack(trackId);

  // If there is no current track, set it to the first in the playlist
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0].id);
    }
  }, [tracks, currentTrack]);

  // Set WS listeners for playback sync
  useEffect(() => {
    webSocket.current.on('togglePlay', togglePlay);
    webSocket.current.on('changeTrack', changeTrack);
  }, []);

  const togglePlayHandler = (): void => {
    togglePlay(play);
    webSocket.current.emit('togglePlay', playlist.current, play);
  };

  const trackFinishHandler = (): void => {
    if (getPositionInPlaylist(tracks, currentTrack) !== 'end') {
      let newTrackIndex = getCurrentTrackIndex(tracks, currentTrack) + 1;
      const trackId = tracks[newTrackIndex].id;
      changeTrack(trackId);
      setPlay(true);
      setPlay(false);
      setPlay(true);
      // setTimeout(() => {

      // }, 500);
    }
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    let currentTrackIndex = getCurrentTrackIndex(tracks, currentTrack);
    const newTrackIndex = direction === 'prev' ? currentTrackIndex - 1 : currentTrackIndex + 1;
    const trackId = tracks[newTrackIndex].id;

    changeTrack(trackId);
    webSocket.current.emit('changeTrack', playlist.current, trackId);
  };

  const spotifyCallback = (state: any) => {
    if (play && state.type === 'track_update') setPlay(true);
    if (state.progressMs === 0 && !state.isPlaying && state.type === 'player_update') {
      console.log('finished?');
      trackFinishHandler();
    }
    console.log(state);
  };

  return (
    <div className={classes.root}>
      <SpotifyPlayer
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
        positionInPlaylist={getPositionInPlaylist(tracks, currentTrack)}
        play={play}
      />
    </div>
  );
}
