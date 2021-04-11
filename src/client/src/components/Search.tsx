import { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(() => ({
  root: {
  },
  searchIcon: {
  },
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

type searchProps = {
  addTrackHandler: (track: SpotifyApi.TrackObjectFull) => void,
  searchHandler: (id: string) => void,
  searchTracks: any
}

export default function Search({ addTrackHandler, searchHandler, searchTracks }: searchProps) {

  const [textValue, setTextValue] = useState('');
  const classes = useStyles();

  const listItems = searchTracks && searchTracks.map((track: any) => {
    return (
        <li className={classes.track} key={track.id}>
          <img
            src={track.album.images[2].url}
            alt={track.album.name}
          ></img>
          <h4 className={classes.trackLabel}>
            {track.artists[0].name} - {track.name}
          </h4>
          <IconButton
            aria-label="delete"
            onClick={() => addTrackHandler(track)}
            className={classes.addIcon}
          >
            <AddIcon fontSize="large"/>
          </IconButton>
        </li>
    )
  })

  return (

    <div className={classes.root}>
      <TextField
           value={textValue}
           onChange={e => setTextValue(e.target.value)}
        />
      <IconButton
        aria-label="search"
        onClick={() => searchHandler(textValue)}
      >
        <SearchIcon className={classes.searchIcon} fontSize="large"/>
      </IconButton>
      <ul>
        {listItems}
      </ul>
    </div>

  )

};