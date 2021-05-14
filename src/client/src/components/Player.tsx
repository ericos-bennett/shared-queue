import { makeStyles } from '@material-ui/core/styles';

import PlayerControls from './PlayerControls';
import { RoomState } from '../../types';

const useStyles = makeStyles(() => ({
  track: {
    display: 'flex',
    position: 'absolute',
    bottom: '0px',
    alignItems: 'center',
    margin: '1rem',
  },
  current: {
    marginRight: '1rem',
  },
  trackLabel: {
    marginLeft: '1rem',
  },
  deleteIcon: {
    marginLeft: '1rem',
  },
}));


export default function Player({ roomState, togglePlayHandler, changeTrackHandler }: PlayerProps) {
  const classes = useStyles();

  const track = roomState?.tracks[roomState!.currentTrackIndex];

  return (
    <div>
      {track && (
        <div className={classes.track}>
          <h4 className={classes.current}>Current Track</h4>
          <img src={track.albumUrl} alt={track.artist}></img>
          <h4 className={classes.trackLabel}>
            {track.artist} - {track.title}
          </h4>
        </div>
      )}
      <PlayerControls />
    </div>
  );
}
