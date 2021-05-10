import PlayerControls2 from './PlayerControls2';
import { RoomState } from '../../types';

type Player2Props = {
  roomState: RoomState | null;
  togglePlayHandler: () => void;
  changeTrackHandler: (direction: 'prev' | 'next') => void;
};

export default function Player2({
  roomState,
  togglePlayHandler,
  changeTrackHandler,
}: Player2Props) {
  return (
    <div>
      <PlayerControls2
        roomState={roomState}
        togglePlayHandler={togglePlayHandler}
        changeTrackHandler={changeTrackHandler}
      />
    </div>
  );
}
