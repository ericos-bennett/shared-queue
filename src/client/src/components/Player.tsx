import { useState, useEffect } from "react";
import playbackLoader from '../helpers/spotifyPlaybackLoader';

type SpotifyPlayer = {
  accessToken: string,
  tracks: SpotifyApi.PlaylistTrackObject[]
}

export default function Player({ accessToken, tracks }: SpotifyPlayer) {

  const [player, setPlayer] = useState()
  useEffect(() => {
    (async () => {
      const spotifyPlayer = await playbackLoader(accessToken);
      console.log(spotifyPlayer);
      setPlayer(spotifyPlayer);
    })();
  }, [accessToken])

  return (
    <div>
    </div>
  )

};