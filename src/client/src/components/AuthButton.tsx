import axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
      color: 'white',
      borderColor: 'white'
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
      variant="outlined"
      color="primary"
      onClick={userAuthRedirect}
      className={classes.root}
    >
        Sign In With Spotify
    </Button>
  )

};