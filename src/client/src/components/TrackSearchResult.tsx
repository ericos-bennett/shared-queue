import { makeStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  track: {
    display: 'flex',
    alignItems: 'center',
    margin: '1rem'
  },
  trackLabel: {
    marginLeft: '1rem'
  },
  addIcon: {
    marginLeft: '1rem'
  }
}));

type trackType = {
  artist: string,
  title: string,
  uri: string,
  albumUrl: string
}

type TrackSearchResultProps = {
  track: trackType,
  chooseTrack: (track: trackType) => void
}

export default function TrackSearchResult({ track, chooseTrack }: TrackSearchResultProps) {

  const classes = useStyles();

  return (
    <li className={classes.track} key={track.uri}>
      <img
        src={track.albumUrl}
        alt={track.artist}
      ></img>
      <h4 className={classes.trackLabel}>
        {track.artist} - {track.title}
      </h4>
      <IconButton
        aria-label="add"
        onClick={() => chooseTrack(track)}
        className={classes.addIcon}
      >
        <AddIcon fontSize="large"/>
      </IconButton>
    </li>
  )
}