import SpotifyPlayer from 'react-spotify-web-playback';

type PlayerProps = {
  accessToken: string,
  playlistId: string
}

export default function Player({accessToken, playlistId}: PlayerProps) {

  return(
    <SpotifyPlayer
      token={accessToken}
      uris={`spotify:playlist:${playlistId}`}
      showSaveIcon={true}
      name="Spotify Mix"
    />
  )

};