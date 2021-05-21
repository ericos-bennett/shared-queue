import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { Context } from '../reducers/context';
import { roomActions } from '../actions/roomActions';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    left: '0',
    top: '0',
    margin: theme.spacing(2),
  },
  button: {
    color: 'white',
  },
}));

export default function ExitRoomButton() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Context);
  const [exit, setExit] = useState(false);
  const handleExit = () => {
    roomActions.exitRoom(state, dispatch)
    setExit(true);
  };

  return (
    <div className={classes.root}>
      <Button onClick={handleExit} className={classes.button}>
        Exit Room
      </Button>
      {exit && <Redirect to="/" />}
    </div>
  );
}
