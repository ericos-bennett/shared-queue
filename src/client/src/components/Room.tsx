import { useEffect, useRef, useContext, useCallback } from 'react';
import { useParams } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import { Context } from '../reducers/context';

import Search from './Search';
import Queue from './Queue';
import Player from './Player';

import { roomActions } from '../actions/roomActions';

import ExitRoomButton from './ExitRoomButton';
import LogoutButton from './LogoutButton';

import { websockets } from '../helpers/websockets'
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
  const { state, dispatch } = useContext(Context);
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  const classes = useStyles();


  useEffect(() => {
    !state.spotifyApi && <Redirect to="/" />
  }, [state.spotifyApi])

  useEffect(() => {
    roomActions.setRoomId(dispatch, roomId.current);
  }, [dispatch])



  const setSocket = useCallback(() => {
    websockets.setWS(state, dispatch);
  }, [dispatch, state]);

  useEffect(() => {
    console.info('useEffect >> state.roomId:', state.roomId);
    if (state.roomId) {
      setSocket();
    }
  }, [setSocket, state.roomId]);

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
