import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function JoinButton() {
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState('');  
  
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let history = useHistory();

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Join Room
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Join a Room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="id"
            label="Room Link"
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
          <Button
            onClick={() => history.push(`/room/${textValue}`)}
            color="primary"
          >
            Join Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
