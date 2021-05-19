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
    '&:hover': {
      background: "#f5f5f5",
    },
  },
  trackPlaying: {
    background: "##a8a8a8fc",
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
  const [playlist, setPlaylist] = useState([])


  const updateQueue = useCallback(
    () => {
      setPlaylist(state.tracks)
    },
    [state.tracks],
  )


  useEffect(() => {
    console.info('updateQueue [useEffect]');
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
