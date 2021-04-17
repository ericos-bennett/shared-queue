import { useEffect, useState } from 'react';
import SpotifyWebApi from "spotify-web-api-node"
import SearchBar from "material-ui-search-bar";

import TrackSearchResult from './TrackSearchResult';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
})

type trackType = {
  artist: string,
  title: string,
  uri: string,
  albumUrl: string
}

type searchProps = {
  accessToken: string
  addTrackHandler: (track: trackType) => void,
}

export default function Search({ addTrackHandler, accessToken }: searchProps) {

  const [search, setSearch] = useState('');
  const [searchTracks, setSearchTracks] = useState<trackType[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchTracks([]);
    if (!accessToken) return;

    let cancel = false
    spotifyApi.searchTracks(search, {limit: 5}).then(res => {
      if (cancel) return
      setSearchTracks(
        res!.body!.tracks!.items.map(track => {
          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: track.album.images[2].url
          }
        })
      )
    });

    return function() {
      cancel = true;
    };
  }, [search, accessToken]);

  const chooseTrack = (track: trackType): void => {
    setSearchTracks([])
    addTrackHandler(track)
  };

  return (

    <div>
      <SearchBar
        value={search}
        onChange={value => setSearch(value)}
      />
      <ul>
        {searchTracks.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
      </ul>
    </div>

  )

};