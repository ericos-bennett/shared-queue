export type Track = {
  artist: string,
  title: string,
  id: string,
  albumUrl: string,
  durationMs: number
}

export type PlayerProps = {
  accessToken: string,
  tracks: Track[],
  webSocket: any,
  playlistId: string
}

export type PlaybackStatus = {
  currentTrack: string | undefined,
  isPlaying: boolean,
  progressMs: number
}