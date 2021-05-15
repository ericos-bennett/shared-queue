/* eslint-disable no-redeclare */
// Types
import types from './types'

export default function reducer(state, action) {
    switch (action.type) {

        case types.LOGOUT:
        case types.LOGIN:
            return {
                ...state,
                login_loading: false,
                logged_in: action.payload
            }

        case types.SET_ROOM_ID:
            return {
                ...state,
                roomId: action.payload
            }

        case types.SET_SPOTIFY_API:
            return {
                ...state,
                spotifyApi: action.payload
            }
        case types.SET_SPOTIFY_PLAYER:
            return {
                ...state,
                spotifyPlayer: action.payload
            }



        case types.SET_ROOM_STATE:
            return {
                ...state,
                roomState: action.payload
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
