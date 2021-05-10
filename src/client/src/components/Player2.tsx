import { useEffect, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Cookie from 'js-cookie';

import { RoomState } from '../../types';

type Player2Props = {
  roomState: RoomState | null;
  deviceId: string | null;
};

export default function Player2({ roomState, deviceId }: Player2Props) {
  const hasMounted = useRef<boolean>(false);
  const trackHasLoaded = useRef<boolean>(false);

  // Transfer and sync playback on component mount
  useEffect(() => {
    if (!hasMounted.current && roomState && deviceId) {
      const spotifyApi = new SpotifyWebApi({});
      spotifyApi.setAccessToken(Cookie.get('accessToken')!);

      spotifyApi
        .transferMyPlayback([deviceId])
        .then(() => {
          hasMounted.current = true;
          console.log('Playback transferred to Spotify Mix');

          if (roomState.isPlaying) {
            const currentTrackId = roomState.tracks[roomState.currentTrackIndex].id;
            console.log('track is playing');
            spotifyApi
              .play({
                uris: [`spotify:track:${currentTrackId}`],
                position_ms: roomState.currentTrackPosition,
              })
              .then(() => {
                trackHasLoaded.current = true;
                console.log('Track loaded and playback started');
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [deviceId, roomState]);

  return <div></div>;
}
