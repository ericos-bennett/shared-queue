/* eslint-disable no-redeclare */
// Types
import types from './types'

export default function playerReducer(state, action) {
    switch (action.type) {

        case types.SET_SPOTIFY_API:
            return {
                ...state,
                spotifyApi: action.payload
            }
        case types.SET_DEVICE_ID:
            const { device_id } = action.payload
            return {
                ...state,
                device_id
            }
        case types.SET_ROOM_STATE:
            const { roomState } = action.payload
            return {
                ...state,
                roomState
            }
        case types.PAUSE:
        case types.PLAY:
        case types.CHANGE_TRACK: {
            const { currentTrackIndex, isPlaying } = action.payload
            return {
                ...state,
                isPlaying,
                currentTrackIndex
            }
        }
        case types.DELETE_TRACK: {

            const { currentTrackIndex, tracks } = action.payload

            return {
                ...state,
                tracks,
                currentTrackIndex
            }
        }
        case types.ADD_TRACK: {
            const { track } = action.payload
            let tracks = state.tracks
            tracks.push(track)
            return {
                ...state,
                tracks
            }
        }

        default:
            return state
    }

}
