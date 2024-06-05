import React, { useState, useRef } from 'react';
import { useDrop } from 'react-dnd';
import './Court.css';
import Player from './Player';

const PLAYER_SIZE = 36; // Diameter of the player circle

const Court = () => {
  const [players, setPlayers] = useState([
    { id: '1', x: 300, y: 400, team: 'red', path: [] },
    { id: '2', x: 400, y: 300, team: 'red', path: [] },
    { id: '3', x: 350, y: 200, team: 'red', path: [] },
    { id: '4', x: 450, y: 350, team: 'red', path: [] },
    { id: '5', x: 250, y: 250, team: 'red', path: [] },
    { id: 'x1', x: 300, y: 100, team: 'blue', path: [] },
    { id: 'x2', x: 400, y: 150, team: 'blue', path: [] },
    { id: 'x3', x: 350, y: 50, team: 'blue', path: [] },
    { id: 'x4', x: 450, y: 100, team: 'blue', path: [] },
    { id: 'x5', x: 250, y: 50, team: 'blue', path: [] },
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const courtRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'player',
    hover: (item, monitor) => {
      if (!isDragging) return;
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = item.initialX + delta.x;
      const newY = item.initialY + delta.y;
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === item.id
            ? {
                ...player,
                x: newX,
                y: newY,
                ...(player.team === 'red' && { path: [...(player.path || []), { x: newX + PLAYER_SIZE / 2, y: newY + PLAYER_SIZE / 2 }] }),
              }
            : player
        )
      );
    },
    drop: (item, monitor) => {
      setIsDragging(false);
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = item.initialX + delta.x;
      const newY = item.initialY + delta.y;
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === item.id
            ? {
                ...player,
                x: newX,
                y: newY,
                ...(player.team === 'red' && { path: [...(player.path || []), { x: newX + PLAYER_SIZE / 2, y: newY + PLAYER_SIZE / 2 }] }),
              }
            : player
        )
      );
      setSelectedPlayer(null);
    },
  });

  const handleMouseDown = (player) => {
    setSelectedPlayer(player.team === 'red' ? player : null);
    setIsDragging(true);
    const initialPoint = {
      x: player.x + PLAYER_SIZE / 2,
      y: player.y + PLAYER_SIZE / 2,
    };
    if (player.team === 'red' && player.path.length === 0) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.id === player.id
            ? { ...p, path: [initialPoint] }
            : p
        )
      );
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging && selectedPlayer && selectedPlayer.team === 'red') {
      const courtRect = courtRef.current.getBoundingClientRect();
      const newX = event.clientX - courtRect.left - PLAYER_SIZE / 2;
      const newY = event.clientY - courtRect.top - PLAYER_SIZE / 2;
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === selectedPlayer.id
            ? {
                ...player,
                x: newX,
                y: newY,
                path: [...(player.path || []), { x: newX + PLAYER_SIZE / 2, y: newY + PLAYER_SIZE / 2 }],
              }
            : player
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedPlayer(null);
  };

  const handleContextMenu = (event, player) => {
    event.preventDefault();
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === player.id ? { ...p, path: [] } : p
      )
    );
  };

  const getPathD = (path) => {
    if (!path || path.length < 2) return '';
    const d = path.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = arr[i - 1];
      const midX = (prev.x + point.x) / 2;
      const midY = (prev.y + point.y) / 2;
      return `${acc} Q ${prev.x} ${prev.y} ${midX} ${midY}`;
    }, '');
    const last = path[path.length - 1];
    return `${d} T ${last.x} ${last.y}`;
  };

  return (
    <div
      className="court"
      ref={courtRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="half-court" ref={drop}>
        <div className="center-circle"></div>
        <div className="free-throw-circle"></div>
        <div className="three-point-line"></div>
        <div className="key"></div>
        <div className="basket"></div>
        <div className="backboard"></div>
        {players.map((player) => (
          <React.Fragment key={player.id}>
            <Player
              id={player.id}
              x={player.x}
              y={player.y}
              team={player.team}
              onMouseDown={() => handleMouseDown(player)}
              onContextMenu={(e) => handleContextMenu(e, player)}
            />
            {player.team === 'red' && (
              <svg className="path" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <path
                  d={getPathD(player.path)}
                  style={{ fill: 'none', stroke: player.team === 'red' ? 'red' : 'blue', strokeWidth: 2 }}
                />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Court;
