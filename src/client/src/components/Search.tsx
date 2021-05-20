import { useState, useEffect, useContext } from 'react';
import SearchBar from 'material-ui-search-bar';

import { Track, ServerResponse, ResTrack } from '../../types';
import TrackSearchResult from './TrackSearchResult';

import { Context } from '../reducers/context';
import { playerActions } from '../actions/playerActions';

export default function Search() {
  const [search, setSearch] = useState<string>('');
  const [searchTracks, setSearchTracks] = useState<Track[]>([]);
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    if (!search) return setSearchTracks([]);

    let cancel = false;
    state.spotifyApi &&
      state.spotifyApi.searchTracks(search, { limit: 5 }).then((res: ServerResponse) => {
        if (cancel) return;
        setSearchTracks(
          res!.body!.tracks!.items.map((track: ResTrack) => {
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
  }, [setSearchTracks, search, state.spotifyApi]);

  const chooseTrack = (track: Track): void => {
    setSearchTracks([]);
    setSearch('');
    playerActions.addTrack(state, dispatch, track);
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
