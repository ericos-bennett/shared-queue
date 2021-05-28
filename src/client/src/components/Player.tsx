import { useContext, Fragment, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import PlayerControls from './PlayerControls';
import { Context } from '../reducers/context';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { playerActions } from '../actions/playerActions';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import { changeTrack as phChangeTrack } from '../helpers/playerHelper';
import Slider from '@material-ui/core/Slider';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
const useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // position: 'absolute',
    // alignItems: 'center',
  },


  volume: {
    maxWidth: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeSlider: {
    maxWidth: '200px',
  },
  track: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1),
  },
  player: {
    margin: 'auto',
    minHeight: '96px',
    bottom: '0%',
    position: 'fixed',
    width: '100%',
    // background: theme.palette.primary.light,

  },
  trackLabel: {
    marginLeft: theme.spacing(3),
  },
  playTime: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-start",
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: "flex-end",
  },
  progess: {
    position: 'relative',
    width: '100%',
    top: '0%',
    margin: theme.spacing(0),
    padding: 0,
  },
}));

export default function Player() {
  const { state, dispatch } = useContext(Context);

  const classes = useStyles();

  const track = state?.tracks[state!.currentTrackIndex];

  const position = useRef(1)
  const trackStopped = useRef(false)
  const [value, setVolume] = useState(100);

  const progress = !track ? 0 : state.currentTrackPosition === 0 ? 0 : ((state.currentTrackPosition) / track.durationMs) * 100


  useEffect(() => {
    playerActions.getVolume(state, dispatch).then((res: any) => {
      setVolume(res * 100)
    })


  }, [playerActions])

  useEffect(() => {

    let playerInterval = setInterval(() => {

      state.spotifyPlayer && state.isPlaying &&
        state.spotifyPlayer.getCurrentState().then((s: any) => {
          if (s) {
            position.current = s.position
            playerActions.updateCurrentTrackPostion(state, dispatch, s.position)

            if (position.current === 0) {
              if (trackStopped.current) {
                playerActions.changeTrack(state, dispatch, phChangeTrack(state, 'next'))

                trackStopped.current = false
              } else {
                trackStopped.current = true
              }
            }
          }
        });
    }, 500)

    //Clean up can be done like this
    return () => {
      clearInterval(playerInterval);
      // clearInterval(playerTimer);
    }
  }, [state, dispatch])



  const handleVolumeChange = (event: any, volume: any) => {
    console.log('volume :>> ', volume);
    playerActions.setVolume(state, dispatch, (volume / 100))
    setVolume(volume);
  };

  const handleProgressChange = (event: any, newValue: any) => {
    position.current = newValue
    playerActions.setCurrentTrackPostion(state, dispatch, track.durationMs * (newValue / 100))
  };

  const renderProgress = () => {
    return (

      <Fragment>
        <Slider value={progress} onChange={handleProgressChange} className={classes.progess} />
      </Fragment>
    )
  }
  const renderNav = () => {
    return (
      <Fragment>
        <Grid container
          direction="row"
          justify="center"
          alignItems="center"
          // className={classes.player}
          spacing={2}>
          <Grid item xs={6} className={classes.controls} >
            <PlayerControls />
          </Grid>
          <Grid item xs={6}>
            {track && (
              <Typography variant="body1" className={classes.playTime}>
                {moment.utc(moment.duration(position.current).asMilliseconds()).format("mm:ss")}
                {' / '}
                {moment.utc(moment.duration(track.durationMs).asMilliseconds()).format("mm:ss")}

              </Typography>
            )}
          </Grid>
        </Grid>

      </Fragment>
    )
  }
  const renderTrack = () => {
    return (
      track && (
        <Box className={classes.track}>
          <img src={track.albumUrl} alt={track.artist}></img>
          <Typography variant="body1" className={classes.trackLabel}>
            {track.artist} - {track.title}
          </Typography>
        </Box>
      )
    )
  }

  const renderOptions = () => {
    return (
      <Fragment>

        <Grid container
          direction="row"
          justify="center"
          alignItems="center"
          // className={classes.player}
          spacing={2}>
          <Grid item xs={6}  >

          </Grid>
          <Grid item xs={6}>
            <Box className={classes.volume}>
              <Grid container className={classes.volumeSlider} spacing={2}>
                <Grid item xs={12}>
                  <Typography id="continuous-slider" gutterBottom>
                    Volume
                </Typography>
                </Grid>
                <Grid item>
                  <VolumeDown />
                </Grid>
                <Grid item xs>
                  <Slider value={value} onChange={handleVolumeChange} />
                </Grid>
                <Grid item>
                  <VolumeUp />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <Box className={classes.root}>
        <Grid container
          direction="row"
          justify="space-evenly"
          alignItems="center"
          className={classes.player}
          spacing={2}>
          {track && renderProgress()}
          <Grid item xs={4}>
            {renderNav()}
          </Grid>
          <Grid item xs={4}>
            {renderTrack()}
          </Grid>
          <Grid item xs={4}>
            {renderOptions()}
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
