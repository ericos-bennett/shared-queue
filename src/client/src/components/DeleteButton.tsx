import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { playerActions } from '../actions/playerActions';
import Context from '../reducers/context';

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

interface props {
  queueIndex: number;
}

export default function DeleteButton(props: props) {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);

  const { queueIndex } = props;

  const handleDeleteTrackClick = () => {
    playerActions.deleteTrack(state, dispatch, queueIndex);
  };

  return (
    <IconButton aria-label="delete" onClick={handleDeleteTrackClick} className={classes.deleteIcon}>
      <DeleteIcon fontSize="large" />
    </IconButton>
  );
}
