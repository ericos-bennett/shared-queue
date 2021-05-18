import { useContext, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Context } from '../reducers/context';
import DeleteButton from './DeleteButton';

const useStyles = makeStyles(() => ({
  root: {
    padding: '0',
    listStyleType: 'none',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    margin: '1rem',
  },
  trackLabel: {
    marginLeft: '1rem',
  },
  deleteIcon: {
    marginLeft: '1rem',
  },
  emptyTracks: {
    textAlign: 'center',
  },
}));

export default function Queue() {
  const classes = useStyles();
  const { state } = useContext(Context);
  const { spotifyApi } = state
  const [playlist, setPlaylist] = useState([])

  const updateQueue = useCallback(
    () => {
      // Get a playlist
      spotifyApi && spotifyApi.getPlaylist(state.playlistId)
        .then(function (data: any) {
          console.log('data :>> ', data);
          setPlaylist(data.body.tracks.items.map((track: any) => {
            return {
              artist: track.track.artists[0].name,
              title: track.track.name,
              id: track.track.id,
              albumUrl: track.track.album.images[2].url,
              durationMs: track.track.duration_ms,
            };
          }
          ))
          // setTracks()
          console.log('Some information about this playlist', data.body);
        }, function (err: any) {
          console.log('Something went wrong!', err);
        });
    },
    [spotifyApi, state.playlistId],
  )

  useEffect(() => {
    console.log('updateQueue [useEffect]');
    updateQueue()
  }, [state.tracks, updateQueue])

  const listItems = playlist!.map((track: any, i: number) => {
    return (
      <li className={classes.track} key={i}>
        <img src={track.albumUrl} alt={track.artist}></img>
        <h4 className={classes.trackLabel}>
          {track.artist} - {track.title}
        </h4>
        <DeleteButton queueIndex={i} />
      </li>
    );
  });

  return (
    <ul className={classes.root}>
      {playlist.length ? (
        listItems
      ) : (
        <p className={classes.emptyTracks}>Add tracks above to get started!</p>
      )}
    </ul>
  );
}
