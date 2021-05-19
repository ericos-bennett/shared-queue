import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Context } from '../reducers/context';

const useStyles = makeStyles(() => ({
  button: {
    color: 'white',
    borderColor: 'white',
    backgroundColor: '#159442',
    height: '3rem',
    ' &:hover': {
      backgroundColor: '#1DB954',
    },
  },
}));

export default function CreateButton() {
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState('Test');
  const { state } = useContext(Context);
  let history = useHistory();
  const classes = useStyles();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateRoom = () => {
    history.push(`/room/${textValue}`)
  }

  return (
    <div>
      <Button className={classes.button} variant="contained" onClick={handleClickOpen} disabled={!state.spotifyApi}>
        Create Room
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateRoom} color="primary">
            Create Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
