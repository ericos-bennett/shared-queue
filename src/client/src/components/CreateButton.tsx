import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function CreateButton() {
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState('');

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let history = useHistory();

  const createRoom = async (name: string) => {
    const res = await axios.post('/api/room', { name });
    history.push(`/room/${res.data}`);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
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
          <Button onClick={() => createRoom(textValue)} color="primary">
            Create Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
