import { State } from '../../types';
import { types } from '../reducers/actionTypes';
import { playerActions } from './playerActions';

const setRoomId = (dispatch: any, payload: string) => {
  console.info('setRoomId');
  dispatch({
    type: types.SET_ROOM_ID,
    payload,
  });
};

const exitRoom = (state: State, dispatch: any) => {
  console.info('exitRoom');
  playerActions.pause(state, dispatch)
  dispatch({
    type: types.EXIT_ROOM
  });
};

export const roomActions = {
  setRoomId,
  exitRoom
};
