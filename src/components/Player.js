// src/components/Player.js
import React from 'react';
import { useDrag } from 'react-dnd';
import './Player.css';

const Player = ({ id, x, y, team }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'player',
    item: { id, x, y },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`player ${team}`}
      style={{ left: `${x}px`, top: `${y}px`, opacity: isDragging ? 0.5 : 1 }}
    >
      {id}
    </div>
  );
};

export default Player;
