import { useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Context } from '../reducers/context';
import Search from './Search';
import Queue from './Queue';
import Player from './Player';

import ExitRoomButton from './ExitRoomButton';
import LogoutButton from './LogoutButton';

import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#CDCDCD',
  },
  title: {
    textAlign: 'center',
  },
}));

export default function Room() {
  const { state } = useContext(Context);

  const classes = useStyles();

  useEffect(() => {
    !state.spotifyApi && <Redirect to="/" />
  }, [state.spotifyApi])

  return (
    <div className={classes.root}>
      <Container>
        <h1 className={classes.title}>Room: {state.roomId}</h1>
        <LogoutButton />
        <ExitRoomButton />
        <Search />
        <Queue />
        <Player />
      </Container>
    </div>
  );
}
