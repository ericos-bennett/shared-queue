import React from 'react'

export const Context = React.createContext()

export const initialState = {
    spotifyApi: null,
    spotifyPlayer: null,
    isPlaying: false,
    currentTrackIndex: -1,
    tracks: [],
    roomState: {},
    roomId: null,
    login_loading: false,
    logged_in: false
}

export default Context
