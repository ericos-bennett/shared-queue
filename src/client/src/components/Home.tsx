import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from '@material-ui/core';

const userAuthRedirect = async () => {
  const res = await axios.get('/api/auth/code');
  window.location.href = res.data;
}

// const createPlaylist = async () => {
//   const res = await axios.post('/api/playlist', {name: 'abc'});
//   console.log(res)
// }

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(90deg, #2c5e92 0%, #552f6d 80%)'

  },
  banner: {
    width: '60%',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  description: {
    paddingTop: '40px',
    textAlign: 'center'
  },
  buttons: {
    width: '60%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  button: {
    width: '25%',
    height: '150%',
    color: 'white',
    borderColor: 'white'
  }
}));

export default function Home() {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.banner}>
        <Typography variant="h2">
          Welcome to Spotify Mix!
        </Typography>
        <Typography variant="h4" className={classes.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
      </div>
      <div className={classes.buttons}>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={userAuthRedirect}
        >
          New Mix
        </Button>
        <Button
          className={classes.button}
          variant="outlined"
          onClick={() => console.log('implement me!')}
        >
          Tune In
        </Button>
      </div>
    </div>
  );
}
