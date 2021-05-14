import types from '../reducers/types'

const setDeviceId = (dispatch, payload) => {

    dispatch({
        type: types.SET_DEVICE_ID,
        payload
    })
}

const setSpotifyApi = (dispatch, payload) => {

    dispatch({
        type: types.SET_SPOTIFY_API,
        payload
    })
}

const setRoomState = (dispatch, payload) => {

    dispatch({
        type: types.SET_ROOM_STATE,
        payload
    })
}

const setWebsocket = (dispatch, payload) => {
    dispatch({
        type: types.SET_WEBSOCKET,
        payload
    })
}

export const roomActions = {
    setSpotifyApi,
    setDeviceId,
    setRoomState,
    setWebsocket
}


