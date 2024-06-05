// src/components/Court.js
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import './Court.css';
import Player from './Player';

const Court = () => {
  const [players, setPlayers] = useState([
    { id: '1', x: 300, y: 400, team: 'red' },
    { id: '2', x: 400, y: 300, team: 'red' },
    { id: '3', x: 350, y: 200, team: 'red' },
    { id: '4', x: 450, y: 350, team: 'red' },
    { id: '5', x: 250, y: 250, team: 'red' },
    { id: 'x1', x: 300, y: 100, team: 'blue' },
    { id: 'x2', x: 400, y: 150, team: 'blue' },
    { id: 'x3', x: 350, y: 50, team: 'blue' },
    { id: 'x4', x: 450, y: 100, team: 'blue' },
    { id: 'x5', x: 250, y: 50, team: 'blue' },
  ]);

  const [, drop] = useDrop({
    accept: 'player',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === item.id
            ? {
                ...player,
                x: player.x + delta.x,
                y: player.y + delta.y,
              }
            : player
        )
      );
    },
  });

  return (
    <div className="court" ref={drop}>
      <div className="half-court">
        <div className="center-circle"></div>
        <div className="free-throw-circle"></div>
        <div className="three-point-line"></div>
        <div className="key"></div>
        <div className="basket"></div>
        <div className="backboard"></div>
        {players.map((player) => (
          <Player
            key={player.id}
            id={player.id}
            x={player.x}
            y={player.y}
            team={player.team}
          />
        ))}
      </div>
    </div>
  );
};

export default Court;
