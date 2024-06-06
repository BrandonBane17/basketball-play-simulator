import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import './Court.css';
import Player from './Player';

const PLAYER_SIZE = 36;

const initialPlayers = [
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
];

const Court = () => {
  const [players, setPlayers] = useState(initialPlayers);
  const [isDragging, setIsDragging] = useState(false);
  const [arrowType, setArrowType] = useState(null);
  const [arrowStart, setArrowStart] = useState(null);
  const [arrows, setArrows] = useState([]);

  const canvasRef = useRef(null);
  const courtRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'player',
    hover: (item, monitor) => {
      if (!isDragging) return;
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = item.initialX + delta.x;
      const newY = item.initialY + delta.y;
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === item.id
            ? { ...player, x: newX, y: newY }
            : player
        )
      );
    },
    drop: (item, monitor) => {
      setIsDragging(false);
      const delta = monitor.getDifferenceFromInitialOffset();
      const newX = item.initialX + delta.x;
      const newY = item.initialY + delta.y;
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === item.id
            ? { ...player, x: newX, y: newY }
            : player
        )
      );
    },
  });

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseMove = () => {};
  const handleMouseUp = () => setIsDragging(false);
  const handleContextMenu = (event) => event.preventDefault();

  const handleMouseClick = (event) => {
    if (!arrowType) return;

    const courtRect = courtRef.current.getBoundingClientRect();
    const x = event.clientX - courtRect.left;
    const y = event.clientY - courtRect.top;

    if (arrowStart) {
      const newArrow = { type: arrowType, start: arrowStart, end: { x, y } };
      drawArrowOnCanvas(newArrow);
      setArrows(prevArrows => [...prevArrows, newArrow]);
      setArrowStart(null);
      setArrowType(null);
    } else {
      setArrowStart({ x, y });
    }
  };

  const drawArrowOnCanvas = (arrow) => {
    const ctx = canvasRef.current.getContext('2d');
    switch (arrow.type) {
      case 'dashed':
        drawDashedArrow(ctx, arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y, 5, 'red');
        break;
      case 'solid':
        drawArrow(ctx, arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y, 5, 'red');
        break;
      case 'screen':
        drawScreen(ctx, arrow.start.x, arrow.start.y, arrow.end.x, arrow.end.y, 5, 'red');
        break;
      default:
        break;
    }
  };

  const startDrawingSolidArrow = () => setArrowType('solid');
  const startDrawingDashedArrow = () => setArrowType('dashed');
  const startDrawingScreen = () => setArrowType('screen');

  const undoLastArrow = () => {
    setArrows(prevArrows => {
      const newArrows = prevArrows.slice(0, -1);
      redrawCanvas(newArrows);
      return newArrows;
    });
  };

  const resetCourt = () => {
    setPlayers(initialPlayers);
    setArrows([]);
    clearCanvas();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const redrawCanvas = (arrowsToDraw) => {
    clearCanvas();
    arrowsToDraw.forEach(drawArrowOnCanvas);
  };

  const drawArrow = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
    var headlen = 10;
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = arrowWidth;

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
    ctx.stroke();
    ctx.restore();
  };

  const drawDashedArrow = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
    var headlen = 10;
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = arrowWidth;
    ctx.setLineDash([10, 5]);

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
    ctx.stroke();
    ctx.restore();
  };

  const drawScreen = (ctx, fromx, fromy, tox, toy, arrowWidth, color) => {
    var headlen = 10;
    var angle = Math.atan2(toy - fromy, tox - fromx);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = arrowWidth;

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 2), toy - headlen * Math.sin(angle - Math.PI / 2));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 2), toy - headlen * Math.sin(angle + Math.PI / 2));
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const court = courtRef.current;
    if (canvas && court) {
      canvas.width = court.offsetWidth;
      canvas.height = court.offsetHeight;
    }
  }, []);

  return (
    <div
      className="court"
      ref={courtRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleMouseClick}
    >
      <button 
  onClick={startDrawingSolidArrow} 
  style={{ 
    position: 'absolute', 
    top: 20, 
    left: 20, 
    zIndex: 10, 
    padding: '10px', 
    backgroundColor: 'white', 
    border: '2px solid black', 
    cursor: 'pointer' 
  }}
>
  Draw Solid Arrow
</button>
<button 
  onClick={startDrawingDashedArrow} 
  style={{ 
    position: 'absolute', 
    top: 60,
    left: 20, 
    zIndex: 10, 
    padding: '10px', 
    backgroundColor: 'white', 
    border: '2px solid black', 
    cursor: 'pointer' 
  }}
>
  Draw Dashed Arrow
</button>
<button 
  onClick={startDrawingScreen}
  style={{ 
    position: 'absolute', 
    top: 100,
    left: 20, 
    zIndex: 10, 
    padding: '10px', 
    backgroundColor: 'white', 
    border: '2px solid black', 
    cursor: 'pointer' 
  }}
>
  Draw Screen
  </button>
  <button 
    onClick={resetCourt} 
    style={{ 
      position: 'absolute', 
      top: 20,
      right: 20,
      zIndex: 10, 
      padding: '10px', 
      backgroundColor: 'white', 
      border: '2px solid black', 
      cursor: 'pointer' 
    }}
  >
  Reset Court
</button>
<button 
  onClick={undoLastArrow} 
  style={{ 
    position: 'absolute', 
    top: 60,
    right: 20,
    zIndex: 10, 
    padding: '10px', 
    backgroundColor: 'white', 
    border: '2px solid black', 
    cursor: 'pointer' 
  }}
>
  Undo Last Arrow

</button>

      <div className="half-court" ref={drop}>
        <div className="center-circle"></div>
        <div className="free-throw-circle"></div>
        <div className="three-point-line"></div>
        <div className="key"></div>
        <div className="basket"></div>
        <div className="backboard"></div>

        {/* Add the canvas element for drawing arrows */}
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>

        {players.map((player) => (
          <Player
            key={player.id}
            id={player.id}
            x={player.x}
            y={player.y}
            team={player.team}
            onMouseDown={() => handleMouseDown(player)}
            onContextMenu={(e) => handleContextMenu(e, player)}
          />
        ))}
      </div>
    </div>
  );
};

export default Court;
