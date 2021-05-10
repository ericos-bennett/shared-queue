import { useState, useEffect, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';

import { RoomState } from '../../types';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: '10px',
    height: '60px',
    width: '100px',
    left: 'calc(50vw - 50px)',
    backgroundColor: 'white',
    '& button': {
      padding: '0',
      color: 'rgb(51, 51, 51)',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
  },
  playPause: {
    fontSize: '28px',
  },
  prevNext: {
    fontSize: '16px',
  },
  svg: {
    display: 'block',
    height: '1em',
    width: '1em',
  },
}));

type Player2Props = {
  roomState: RoomState | null;
  deviceId: string | null;
};

export default function Player2({ roomState, deviceId }: Player2Props) {
  const [play, setPlay] = useState<boolean>(false);
  const spotifyApi = useRef<SpotifyWebApi>();
  const trackHasLoaded = useRef<boolean>(false);
  const classes = useStyles();

  // Transfer and sync playback on component mount
  useEffect(() => {
    if (!spotifyApi.current && roomState && deviceId) {
      const api = new SpotifyWebApi({});
      api.setAccessToken(Cookie.get('accessToken')!);
      spotifyApi.current = api;

      api
        .transferMyPlayback([deviceId])
        .then(() => {
          console.log('Playback transferred to Spotify Mix');

          if (roomState.isPlaying) {
            const currentTrackId = roomState.tracks[roomState.currentTrackIndex].id;
            api
              .play({
                uris: [`spotify:track:${currentTrackId}`],
                position_ms: roomState.currentTrackPosition,
              })
              .then(() => {
                setPlay(true);
                trackHasLoaded.current = true;
                console.log('Playback started for the first time');
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [deviceId, roomState]);

  const togglePlayHandler = () => {
    if (play) {
      spotifyApi
        .current!.pause()
        .then(() => {
          setPlay(false);
          console.log('Playback paused');
        })
        .catch(err => console.log(err));
    } else {
      if (trackHasLoaded.current) {
        spotifyApi
          .current!.play()
          .then(() => {
            setPlay(true);
            console.log('Playback resumed');
          })
          .catch(err => console.log(err));
      } else {
        const currentTrackId = roomState!.tracks[roomState!.currentTrackIndex].id;
        spotifyApi
          .current!.play({
            uris: [`spotify:track:${currentTrackId}`],
            position_ms: roomState!.currentTrackPosition,
          })
          .then(() => {
            setPlay(true);
            trackHasLoaded.current = true;
            console.log('Playback started for the first time');
          })
          .catch(err => console.log(err));
      }
    }
  };

  return (
    <div>
      {!play && (
        <button
          type="button"
          aria-label="Play"
          className={classes.playPause}
          onClick={() => togglePlayHandler()}
        >
          <svg className={classes.svg} viewBox="0 0 128 128" preserveAspectRatio="xMidYMid">
            <path d="M119.351 64L8.65 0v128z" fill="currentColor"></path>
          </svg>
        </button>
      )}
      {play && (
        <button
          type="button"
          aria-label="Pause"
          className={classes.playPause}
          onClick={() => togglePlayHandler()}
        >
          <svg className={classes.svg} viewBox="0 0 128 128" preserveAspectRatio="xMidYMid">
            <path
              d="M41.86 128V0H8.648v128h33.21zm77.491 0V0h-33.21v128h33.21z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
}
