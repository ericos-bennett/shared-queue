import { useState, useEffect, useRef } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import Cookie from 'js-cookie';

import { RoomState, Track } from '../../types';

export default function useRoom() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [spotifyApi, setSpotifyApi] = useState<SpotifyWebApi | null>(null);
  const trackHasLoaded = useRef<boolean>(false);
  const deviceId = useRef<string>();

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
        console.log('Track switched');
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

  return {
    roomState,
    setRoomState,
    spotifyApi,
    deviceId,
    togglePlayHandler,
    changeTrackHandler,
    deleteTrackHandler,
    addTrackHandler,
  };
}
