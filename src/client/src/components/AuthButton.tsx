import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";

import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  root: {
      color: 'white',
      borderColor: 'white'
    }
}));

export default function AuthButton() {

  let history = useHistory();
  const classes = useStyles();

  const userAuthRedirect = async () => {
    const res = await axios.get('/api/auth/code');
    history.push(res.data);
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