import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import io from 'socket.io-client';
import SpotifyWebApi from 'spotify-web-api-node';
import Cookie from 'js-cookie';

import Search2 from './Search2';
import Queue from './Queue';
import Player2 from './Player2';
import { RoomState, Track } from '../../types';

const ENDPOINT = 'http://localhost:3000';

export default function Room2() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [spotifyApi, setSpotifyApi] = useState<SpotifyWebApi | null>(null);
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  const ws = useRef<SocketIOClient.Socket | null>(null);
  const deviceId = useRef<string>();
  const trackHasLoaded = useRef<boolean>(false);

  useEffect(() => {
    // 1. Get Access Token
    // Refactor this to use a session cookie on the client side, linking to tokens on server
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

          sdk.addListener('ready', ({ device_id }: { device_id: string }) => {
            console.log('SDK connected and deviceId set');
            deviceId.current = device_id;

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
          });

          sdk.addListener('player_state_changed', (state: any) => {
            // console.log(state);
          });

          // Connect to the player!
          sdk.connect();
        };
      };
    }
  }, []);

  // Transfer and sync playback on component mount
  useEffect(() => {
    if (!spotifyApi && roomState) {
      const api = new SpotifyWebApi({});
      api.setAccessToken(Cookie.get('accessToken')!);
      setSpotifyApi(api);

      api
        .transferMyPlayback([deviceId.current!])
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
                setRoomState({ ...roomState, isPlaying: true });
                trackHasLoaded.current = true;
                console.log('Playback started for the first time');
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [roomState, spotifyApi]);

  const togglePlayHandler = () => {
    if (roomState?.isPlaying) {
      spotifyApi!
        .pause()
        .then(() => {
          setRoomState({ ...roomState, isPlaying: false });
          console.log('Playback paused');
        })
        .catch(err => console.log(err));
    } else {
      if (trackHasLoaded.current) {
        spotifyApi!
          .play()
          .then(() => {
            setRoomState({ ...roomState!, isPlaying: true });
            console.log('Playback resumed');
          })
          .catch(err => console.log(err));
      } else {
        const currentTrackId = roomState!.tracks[roomState!.currentTrackIndex].id;
        spotifyApi!
          .play({
            uris: [`spotify:track:${currentTrackId}`],
            position_ms: roomState!.currentTrackPosition,
          })
          .then(() => {
            setRoomState({ ...roomState!, isPlaying: true });
            trackHasLoaded.current = true;
            console.log('Playback started for the first time');
          })
          .catch(err => console.log(err));
      }
    }
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    const newTrackIndex =
      direction === 'prev' ? roomState!.currentTrackIndex - 1 : roomState!.currentTrackIndex + 1;
    const newTrackId = roomState!.tracks[newTrackIndex].id;

    spotifyApi!
      .play({
        uris: [`spotify:track:${newTrackId}`],
      })
      .then(() => {
        setRoomState({
          ...roomState!,
          isPlaying: true,
          currentTrackIndex: newTrackIndex,
        });
      })
      .catch(err => console.log(err));
  };

  const deleteTrackHandler = (trackIndex: number) => {
    const tracks = [...roomState!.tracks];
    tracks.splice(trackIndex, 1);

    // What should this do when you delete the currently playing track?
    setRoomState({
      ...roomState!,
      tracks,
      currentTrackIndex:
        trackIndex < roomState!.currentTrackIndex!
          ? roomState!.currentTrackIndex - 1
          : roomState!.currentTrackIndex,
    });
  };

  const addTrackHandler = (track: Track) => {
    const tracks = [...roomState!.tracks];
    tracks.push(track);
    setRoomState({
      ...roomState!,
      tracks,
    });
  };

  return (
    <div>
      <Search2 spotifyApi={spotifyApi} addTrackHandler={addTrackHandler} />
      <Queue roomState={roomState} deleteTrackHandler={deleteTrackHandler} />
      <Player2
        roomState={roomState}
        togglePlayHandler={togglePlayHandler}
        changeTrackHandler={changeTrackHandler}
      />
    </div>
  );
}
