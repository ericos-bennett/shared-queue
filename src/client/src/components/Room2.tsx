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
  const isStateLoaded = useRef<boolean>(false);

  const loadPlaybackSdk = (accessToken: string) => {
    const existingScript = document.getElementById('spotifyPlaybackSdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.id = 'spotifyPlaybackSdk';
      document.body.appendChild(script);
      script.onload = () => {
        console.log('SDK loaded!');
        // @ts-ignore
        window.onSpotifyWebPlaybackSDKReady = () => {
          const token = accessToken;
          // @ts-ignore
          const sdk = new Spotify.Player({
            name: 'Spotify Mix',
            getOAuthToken: (cb: any) => {
              cb(token);
            },
          });

          // Connect to the player!
          sdk.connect().then((connected: boolean) => {
            if (connected) {
              console.log('SDK connected');
            }
          });
        };
      };
    }
  };

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
      loadPlaybackSdk(accessToken);
    }

    ws.current = io(ENDPOINT);
    ws.current.on('roomStateRes', (state: RoomState) => {
      if (!isStateLoaded.current) {
        isStateLoaded.current = true;
        setRoomState(state);
      }
    });

    // WS request for room state
    ws.current.emit('roomStateReq', roomId);

    // If you're the only one in the room, send message: you are the only one in the room add a track to get started!

    // If not response from express server, show error

    // If others in the room, return their state object and sync up with it.

    return () => {
      ws.current?.disconnect();
    };
  }, []);

  return <div>Hello</div>;
}
