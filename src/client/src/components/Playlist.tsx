import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
  },
  tracks: {
    padding: '0',
    listStyleType: 'none'
  },
  track: {
    display: 'flex',
    margin: '1rem'
  },
  trackLabel: {
    marginLeft: '1rem'
  }
}));

type PlaylistProps = {
  name: string
  tracks: any
}

export default function Playlist({name, tracks}: PlaylistProps) {

  const classes = useStyles();

  const listItems = tracks.map((track: any) => {
    return (
      <ul className={classes.tracks}>
        <li className={classes.track}>
          <img
            src={track.track.album.images[2].url}
            alt={track.track.album.name}
          ></img>
          <h4 className={classes.trackLabel}>
            {track.track.artists[0].name} - {track.track.name}
          </h4>
        </li>
      </ul>
    )
  })

  return (
    <div className={classes.root}>
      <h1>Welcome to room {name}!</h1>
      {listItems}
    </div>
  )
};