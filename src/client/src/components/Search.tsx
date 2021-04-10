import { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  root: {
    // position: 'relative',
    // display: 'inline-block'
  },
  searchIcon: {
    // position: 'absolute',
    // right: '0',
    // top: '15',
    // width: '20',
    // height: '20'
  }
}));

type searchProps = {
  addTrackHandler: (id: string) => void,
  searchHandler: (id: string) => void
}

export default function Search({ addTrackHandler, searchHandler }: searchProps) {

  const [textValue, setTextValue] = useState('');
  const classes = useStyles();

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
    </div>

  )

};