import SpotifyPlayer from 'react-spotify-web-playback';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    '& button': {
      outline: 'none'
    }
  }
}));

type Track = {
  artist: string,
  title: string,
  id: string,
  albumUrl: string
}

type PlayerProps = {
  accessToken: string,
  tracks: Track[],
}

export default function Player({accessToken, tracks}: PlayerProps) {

  const classes = useStyles();

  return(
    <div className={classes.root}>
      <SpotifyPlayer
        token={accessToken}
        uris={tracks.map(track => `spotify:track:${track.id}`)}
        showSaveIcon={true}
        name="Spotify Mix"
        styles={{
          height: 80,
        }}
      />
    </div>
  )

};