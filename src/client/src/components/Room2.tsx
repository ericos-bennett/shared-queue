import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import io from 'socket.io-client';
import Cookie from 'js-cookie';

import { Track } from '../../types';

const ENDPOINT = 'http://localhost:3000';

type RoomState = {
  tracks: Track[];
  currentTrackIndex: number;
  currentTrackPosition: number;
  isPlaying: boolean;
};

export default function Room2() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  const ws = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    // 1. Get Access Token
    // 2. Connect SDK
    // 3. Request State from Peers
    // 4. Set State from Peers OR initialize as empty room

    const accessToken = Cookie.get('accessToken');
    if (!accessToken) {
      // Handle this w/ OAuth redirect
      console.log('No access token!');
    } else {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.id = 'spotifyPlaybackSdk';
      document.body.appendChild(script);
      script.onload = () => {
        console.log('SDK loaded');
        // @ts-ignore
        window.onSpotifyWebPlaybackSDKReady = () => {
          // @ts-ignore
          const sdk = new Spotify.Player({
            name: 'Spotify Mix',
            getOAuthToken: (cb: any) => {
              cb(accessToken);
            },
          });

          // Connect to the player!
          sdk.connect().then((connected: boolean) => {
            if (connected) {
              console.log('SDK connected');

              // Set up WS listener and send room state request to peers
              const socket = io(ENDPOINT);

              socket.on('roomState', (state: RoomState) => {
                console.log('Room state received');
                // If you're the only one in the room, send message: you are the only one in the room add a track to get started!

                // If not response from express server, show error

                // If others in the room, return their state object and sync up with it.
                setRoomState(state);
              });

              socket.on('connect', () => {
                console.log('WS connected');
                socket.emit('joinRoom', roomId.current);
                ws.current = socket;
              });
            }
          });
        };
      };
    }
  }, []);

  return <div>{roomState && JSON.stringify(roomState)}</div>;
}
