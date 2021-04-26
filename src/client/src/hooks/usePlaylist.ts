import { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import Cookie from 'js-cookie';
import axios from 'axios';

import { Track } from '../../types'

const ENDPOINT = 'http://localhost:3000'

type PlaylistType = {
  name: string,
  id: string,
  owner: string,
  snapshotId: string,
  tracks: Track[]
}

export default function usePlaylist() {

  const { id } = useParams<{id: string}>();
  const history = useHistory();

  const [playlist, setPlaylist] = useState<PlaylistType | null>();
  
  const deleteTrack = useCallback((index: number) => {
  
    // @ts-ignore - fix this!
    setPlaylist((prev: PlaylistType): PlaylistType => {
      
      // Remove the track in local state
      let playlistClone = { ...prev };
      const tracks = [ ...playlistClone.tracks ];
      tracks?.splice(index, 1);
      playlistClone.tracks = tracks;
      
      // If you are the playlist owner, also delete the track on Spotify's DB
      if (Cookie.get('userId') === prev.owner) {
        axios.delete(`${ENDPOINT}/api/room/${prev.id}/${index}`, 
          { data: { snapshotId: prev.snapshotId }}
        ).then(res => playlistClone.snapshotId = res.data.body.snapshot_id)
        .catch(err => console.log(err));
      }
  
      return playlistClone;
    });
  }, []);
  
  const addTrack = useCallback((track: Track): void => {
    
    // @ts-ignore - fix this!
    setPlaylist((prev: PlaylistType): PlaylistType => {
  
      // Add the track in local state
      const playlistClone = { ...prev };
      const tracks = [ ...playlistClone.tracks ];
      tracks.push(track);
      playlistClone.tracks = tracks;
      
      // If you are the playlist owner, add the track to it on Spotify's DB
      if (Cookie.get('userId') === prev.owner) {
        axios.put(`${ENDPOINT}/api/room/${prev.id}`, { trackId: track.id })
          .then(res => playlistClone.snapshotId = res.data.body.snapshot_id)
          .catch(err => console.log(err));
      }
      
      return playlistClone;
    });
  }, [])
  
  // Gets the playlist object if the user is signed in and one exists
  useEffect(() => {
    if (!Cookie.get('userId')) {
      history.push('/')
    } else {
      (async () => {
        const res = await axios.get(`/api/room/${id}`);
        const spotifyResponse: SpotifyApi.SinglePlaylistResponse = res.data.body;
        
        const playlist = !res.data.body ? null : {
          name: spotifyResponse.name,
          id: spotifyResponse.id,
          owner: spotifyResponse.owner.id,
          snapshotId: spotifyResponse.snapshot_id,
          tracks: spotifyResponse.tracks.items.map(track => {
            return {
              artist: track.track.artists[0].name,
              title: track.track.name,
              id: track.track.id,
              albumUrl: track.track.album.images[2].url,
              durationMs: track.track.duration_ms
            }
          })
        };
  
        setPlaylist(playlist);
  
      })();
    }
  }, [id, history])

  return { playlist, addTrack, deleteTrack }
}
