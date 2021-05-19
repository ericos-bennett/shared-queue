import { types } from '../reducers/actionTypes';
import { playerActions } from './playerActions';

const setRoomId = (dispatch: any, payload: any) => {
  console.info('setRoomId');
  dispatch({
    type: types.SET_ROOM_ID,
    payload,
  });
};

// If you're the first person in the room, make a new one...
// { 2, 3, 4 }
// When you join the room, ask the 'host' for the current state
// 4 joins, 2 sends them the tracklist and current playtime(ms) for them to sync with

const exitRoom = (state: any, dispatch: any) => {
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
