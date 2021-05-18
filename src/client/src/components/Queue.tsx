import { useContext } from 'react';
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

  const listItems = state?.tracks.map((track: any, i: number) => {
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
      {state?.tracks.length ? (
        listItems
      ) : (
        <p className={classes.emptyTracks}>Add tracks above to get started!</p>
      )}
    </ul>
  );
}
