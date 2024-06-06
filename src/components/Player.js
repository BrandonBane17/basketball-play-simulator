import React from 'react';
import { useDrag } from 'react-dnd';

const Player = ({ id, x, y, team, onMouseDown, onContextMenu }) => {
  const [, drag] = useDrag({
    type: 'player',
    item: { id, initialX: x, initialY: y },
  });

  return (
    <div
      ref={drag}
      className={`player ${team}`}
      style={{ left: `${x}px`, top: `${y}px`, backgroundColor: team === 'red' ? 'red' : 'blue' }}
      onMouseDown={onMouseDown}
      onContextMenu={onContextMenu}
    >
      {id}
    </div>
  );
};

export default Player;
