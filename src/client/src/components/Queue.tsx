import { useContext, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Context } from '../reducers/context';
import Box from '@material-ui/core/Box';

import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { playerActions } from '../actions/playerActions';
import { SocketContext } from '../reducers/socketContext';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0',
    listStyleType: 'none',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:hover': {
      background: "#f5f5f5",
      '& .player-controls': {
        opacity: '1',
      },
    },
    '& .player-controls': {
      opacity: '0',
    }
  },
  trackPlaying: {
    background: "#a8a8a8fc",
  },
  trackLabel: {
    marginLeft: '1rem',
  },
  deleteIcon: {
    marginRight: theme.spacing(1),
  },
  emptyTracks: {
    textAlign: 'center',
  },
}));

export default function Queue() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);
  const [playlist, setPlaylist] = useState([])
  const socket = useContext(SocketContext);

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

  const handleDeleteTrackClick = (queueIndex: number) => {
    playerActions.deleteTrack(state, dispatch, queueIndex);
    socket.emit('deleteTrack', state.roomId, queueIndex);
  };

  const handlePlayTrackClick = (i: number) => {
    if (state.currentTrackIndex !== i) {
      playerActions.changeTrack(state, dispatch, i);
      socket.emit('changeTrack', state.roomId, i);
    }
    if (!state.isPlaying) {
      playerActions.play(state, dispatch);
      socket.emit('play', state.roomId);
    }
  };

  const handlePauseTrackClick = () => {
    if (state.isPlaying) {
      playerActions.pause(state, dispatch);
      socket.emit('pause', state.roomId);
    }
  };

  const renderPlay = (i: number) => {
    if (state.currentTrackIndex === i && state.isPlaying) {
      return (
        <IconButton aria-label="delete" onClick={() => handlePauseTrackClick()} className={classes.deleteIcon}>
          <PauseIcon fontSize="large" />
        </IconButton>
      )

    } else {
      return (
        <IconButton aria-label="delete" onClick={() => handlePlayTrackClick(i)} className={classes.deleteIcon}>
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      )

    }
  }


  const listItems = playlist!.map((track: any, i: number) => {
    const isPlayingTrack = state.currentTrackIndex === i
    return (
      <Box position="relative" key={i}>
        <li className={`${classes.track} ${isPlayingTrack && classes.trackPlaying}`} key={i}>
          <img src={track.albumUrl} alt={track.artist}></img>
          <h4 className={classes.trackLabel}>
            {track.artist} - {track.title}
          </h4>
          <Box position="absolute" right="0%" className="player-controls">
            {renderPlay(i)}
            <IconButton aria-label="delete" onClick={() => handleDeleteTrackClick(i)} className={classes.deleteIcon}>
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Box>
        </li>
      </Box>
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
