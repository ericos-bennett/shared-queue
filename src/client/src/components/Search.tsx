import { useState, useEffect, useContext } from 'react';
import SearchBar from 'material-ui-search-bar';
import { makeStyles } from '@material-ui/core/styles';
import { Track, ServerResponse, ResTrack } from '../../types';
import TrackSearchResult from './TrackSearchResult';
import { Context } from '../reducers/context';
import { playerActions } from '../actions/playerActions';
import { SocketContext } from '../reducers/socketContext';
import { useAlert } from 'react-alert'
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0',
    listStyleType: 'none',
  },
  searchResults: {
    backgroundColor: theme.palette.primary.light,
    margin: theme.spacing(0),
    spacing: theme.spacing(0),
  },

}));


export default function Search() {
  const [search, setSearch] = useState<string>('');
  const [searchTracks, setSearchTracks] = useState<Track[]>([]);
  const { state, dispatch } = useContext(Context);
  const classes = useStyles();
  const socket = useContext(SocketContext);
  const alert = useAlert()

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
    clearSearch()
    playerActions.addTrack(state, dispatch, track);
    socket.emit('addTrack', state.roomId, track)
    alert.success('Track added')
  };

  const clearSearch = () => {
    setSearchTracks([]);
    setSearch('');
  }


  return (
    <div>
      <SearchBar value={search} onChange={value => setSearch(value)} onCancelSearch={() => clearSearch()} />
      {searchTracks.length > 0 &&
        <List className={classes.searchResults} aria-label="contacts" >
          {searchTracks.map(track => (
            <TrackSearchResult track={track} key={track.id} chooseTrack={chooseTrack} />
          ))}
        </List>

      }
    </div >
  );
}
