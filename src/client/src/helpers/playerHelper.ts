import { State } from "../../types";

export function changeTrack(state: State, direction: any) {
    const { tracks, currentTrackIndex } = state;
    if (!tracks) {
        return -1;
    }
    switch (direction) {
        case 'prev':
            return currentTrackIndex > 0 ? currentTrackIndex - 1 : -1;
        case 'next':
            return currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : -1;
        default:
            return typeof direction === 'number' && direction <= tracks.length ? direction : -1;
    }
}
