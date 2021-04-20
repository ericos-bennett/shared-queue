import Button from '@material-ui/core/Button';

type PlayerControlsProps = {
  togglePlayHandler: () => void
}

export default function PlayerControls({ togglePlayHandler }: PlayerControlsProps) {
  return (
    <Button
      onClick={() => togglePlayHandler()}
    >
      Play/Pause
    </Button>
  )
};