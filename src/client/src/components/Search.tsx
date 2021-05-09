import { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';
import SearchBar from 'material-ui-search-bar';

import TrackSearchResult from './TrackSearchResult';
import { Track } from '../../types';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

type searchProps = {
  searchTracks: Track[];
  setSearchTracks: (tracks: Track[]) => void;
  addTrackHandler: (track: Track) => void;
  accessToken: string;
};

export default function Search({
  searchTracks,
  setSearchTracks,
  addTrackHandler,
  accessToken,
}: searchProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchTracks([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search, { limit: 5 }).then(res => {
      if (cancel) return;
      setSearchTracks(
        res!.body!.tracks!.items.map(track => {
          return {
            artist: track.artists[0].name,
            title: track.name,
            id: track.id,
            albumUrl: track.album.images[2].url,
            durationMs: track.duration_ms,
          };
        })
      );
    });

    return function () {
      cancel = true;
    };
  }, [setSearchTracks, search, accessToken]);

  const chooseTrack = (track: Track): void => {
    setSearchTracks([]);
    addTrackHandler(track);
  };

  return (
    <div>
      <SearchBar value={search} onChange={value => setSearch(value)} />
      <ul>
        {searchTracks.map(track => (
          <TrackSearchResult track={track} key={track.id} chooseTrack={chooseTrack} />
        ))}
      </ul>
    </div>
  );
}
