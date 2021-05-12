import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import CreateButton from './CreateButton';
import AuthButton from './AuthButton';

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(90deg, #2c5e92 0%, #552f6d 80%)',
  },
  banner: {
    width: '60%',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    paddingTop: '40px',
    textAlign: 'center',
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.banner}>
        <Typography variant="h2">Welcome to Spotify Mix!</Typography>
        <Typography variant="h4" className={classes.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
      </div>
      {Cookie.get('accessToken') ? <CreateButton /> : <AuthButton />}
    </div>
  );
}
