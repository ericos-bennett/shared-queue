export type Track = {
  artist: string,
  title: string,
  id: string,
  albumUrl: string,
  durationMs: number
}

export type PlaylistType = {
  name: string,
  id: string,
  owner: string,
  snapshotId: string,
  tracks: Track[]
}

export type PlayerProps = {
  accessToken: string,
  tracks: Track[],
  socket: any,
  playlistId: string
}

export type PlaybackStatus = {
  currentTrack: string,
  play: boolean,
  progressMs: number
}

export type PlayerControlsProps = {
  togglePlayHandler: () => void
  changeTrackHandler: (direction: 'prev' | 'next') => void
  positionInPlaylist: PlaylistPositions
  play: boolean
}

export type PlaylistPositions = 'empty' | 'only' | 'start' | 'middle' | 'end' | 'deleted'