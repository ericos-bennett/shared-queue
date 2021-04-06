import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
      color: 'white',
      borderColor: 'white',
      backgroundColor: '#159442',
      height: '3rem',
      ' &:hover': {
        backgroundColor: '#1DB954'
      }
    }
}));

export default function AuthButton() {

  const classes = useStyles();

  const userAuthRedirect = async () => {
    const res = await axios.get('/api/auth/code');
    window.location.href = res.data;
  }

  return (
    <Button
      variant="contained"
      onClick={userAuthRedirect}
      className={classes.root}
    >
        Login With Spotify
    </Button>
  )

};