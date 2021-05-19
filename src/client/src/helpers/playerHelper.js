export function changeTrack(state, direction) {
    const { tracks, currentTrackIndex } = state;
    if (!tracks) {
        return -1;
    }
    switch (direction) {
        case 'prev':
            return currentTrackIndex > 0 ? currentTrackIndex - 1 : currentTrackIndex;
        case 'next':
            return currentTrackIndex <= tracks.length - 1 ? currentTrackIndex + 1 : currentTrackIndex;
        default:
            return typeof direction === 'number' && direction <= tracks.length ? direction : -1;
    }
}
