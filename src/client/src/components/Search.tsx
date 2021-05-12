import SearchBar from 'material-ui-search-bar';
import { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-node';

import { Track } from '../../types';
import TrackSearchResult from './TrackSearchResult';

type SearchProps = {
  spotifyApi: SpotifyWebApi | null;
  addTrackHandler: (track: Track) => void;
};

export default function Search({ spotifyApi, addTrackHandler }: SearchProps) {
  const [search, setSearch] = useState<string>('');
  const [searchTracks, setSearchTracks] = useState<Track[]>([]);

  useEffect(() => {
    if (!search) return setSearchTracks([]);

    let cancel = false;
    spotifyApi &&
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

    return () => {
      cancel = true;
    };
  }, [setSearchTracks, search, spotifyApi]);

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
