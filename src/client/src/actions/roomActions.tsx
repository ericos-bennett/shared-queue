import { types } from '../reducers/actionTypes';

const setRoomId = (dispatch: any, payload: any) => {
  console.info('setRoomId');
  dispatch({
    type: types.SET_ROOM_ID,
    payload,
  });
};


export const roomActions = {

  setRoomId,

};
