export type Track = {
  artist: string;
  title: string;
  id: string;
  albumUrl: string;
  durationMs: number;
};

export type PlaylistType = {
  name: string;
  id: string;
  owner: string;
  snapshotId: string;
  tracks: Track[];
};

export type PlayerProps = {
  accessToken: string;
  tracks: Track[];
  socket: any;
  playlistId: string;
};

export type PlaybackStatus = {
  currentTrack: string;
  play: boolean;
  progressMs: number;
};

export type PlayerControlsProps = {
  togglePlayHandler: () => void;
  changeTrackHandler: (direction: 'prev' | 'next') => void;
  positionInPlaylist: PlaylistPositions;
  play: boolean;
};

export type PlaylistPositions = 'empty' | 'only' | 'start' | 'middle' | 'end' | 'deleted';

export type RoomState = {
  tracks: Track[];
  currentTrackIndex: number;
  currentTrackPosition: number;
  isPlaying: boolean;
};

export type sdkErrorMessage = {
  message: string;
};

export type ServerResponse = {
  body: {
  tracks: {
    items: []
  }
}
}
export type ResTrack = {
  artists: Array<{name:string}>,
  name: string,
  id: string,
  album: {images:Array<{url:string}>},
  duration_ms: number,
};

// export type searchResData = {
//   "artists": {
//       "href": string,
//       "items": [
//           {
//               "external_urls": {
//                   "spotify": string
//               },
//               "genres": [],
//               "href": string,
//               "id": string,
//               "images": [
//                   {
//                       "height": number,
//                       "url": string,
//                       "width": number
//                   },
//               ],
//               "name": string,
//               "popularity": number,
//               "type":string,
//               "uri": string
//           }
//       ],
//       "limit": number,
//       "next": null,
//       "offset": number,
//       "previous": null,
//       "total": number
//   }
// };

