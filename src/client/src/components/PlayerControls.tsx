import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Context } from '../reducers/context';
import { playerActions } from '../actions/playerActions';

import Button from '@material-ui/core/Button';

import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import { websockets } from '../helpers/websockets';
import { changeTrack } from '../helpers/playerHelper';
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'space-between',
    bottom: '10px',
    height: '60px',
    width: '100px',
    left: 'calc(50vw - 50px)',
    '& button': {
      padding: '0',
      color: 'rgb(51, 51, 51)',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
  },
  playPause: {
    fontSize: '28px',
  },
  prevNext: {
    fontSize: '16px',
  },
  svg: {
    display: 'block',
    height: '1em',
    width: '1em',
  },
}));

export default function PlayerControls() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);

  const handlePrevClick = () => {
    const trackNumber = changeTrack(state, 'prev')
    playerActions.changeTrack(state, dispatch, trackNumber);
    websockets.changeTrack(state.roomId, changeTrack('prev'));
  };
  const handleTogglePlay = () => {
    if (state.isPlaying) {
      playerActions.pause(state, dispatch)
      websockets.pause(state.roomId);
    } else {
      playerActions.play(state, dispatch)
      websockets.play(state.roomId);
    }
  };
  const handleChangeTrack = () => {
    const trackNumber = changeTrack(state, 'next')
    playerActions.changeTrack(state, dispatch, trackNumber);
    websockets.changeTrack(state.roomId, changeTrack('next'));
  };

  return (
    <div className={classes.root}>
      <Button
        type="button"
        aria-label="Previous Track"
        className={classes.prevNext}
        disabled={!(state && state.tracks.length > 0 && state.currentTrackIndex > 0)}
        onClick={handlePrevClick}
      >
        <SkipPreviousIcon />
      </Button>
      {!state.isPlaying && (
        <Button
          type="button"
          aria-label="Play"
          className={classes.playPause}
          onClick={handleTogglePlay}
          disabled={!(state && state.tracks.length > 0)}
        >
          <PlayArrowIcon />

        </Button>
      )}
      {state && state.tracks.length > 0 && state.isPlaying && (
        <Button
          type="button"
          aria-label="Pause"
          className={classes.playPause}
          onClick={handleTogglePlay}
        >
          <PauseIcon />

        </Button>
      )}
      <Button
        type="button"
        aria-label="Next Track"
        className={classes.prevNext}
        onClick={handleChangeTrack}
        disabled={!(state && state.tracks.length - 1 > state.currentTrackIndex)}
      >
        <SkipNextIcon />
      </Button>

    </div>
  );
}
