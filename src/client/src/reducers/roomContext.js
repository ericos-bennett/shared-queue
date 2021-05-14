import React from 'react'

export const RoomContext = React.createContext()

export const initialState = {
    spotifyApi: null,
    isPlaying: false,
    currentTrackIndex: -1,
    tracks: [],
    device_id: null,
    roomState: null,
    ws: null,
    roomId: null
}

export default RoomContext
