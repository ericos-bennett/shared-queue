import Button from '@material-ui/core/Button';

type PlayerControlsProps = {
  togglePlayHandler: () => void
  changeTrackHandler: (direction: 'prev' | 'next') => void
  positionInPlaylist: 'start' | 'middle' | 'end'
}

export default function PlayerControls({ togglePlayHandler, changeTrackHandler, positionInPlaylist }: PlayerControlsProps) {
  return (
    <div>
      {positionInPlaylist !== 'start' &&
        <Button
          onClick={() => changeTrackHandler('prev')}
        >
          Prev
        </Button>
      }
      <Button
        onClick={() => togglePlayHandler()}
      >
        Play/Pause
      </Button>
      {positionInPlaylist !== 'end' &&
        <Button
          onClick={() => changeTrackHandler('next')}
        >
          Next
        </Button>
      }
    </div>
  )
};