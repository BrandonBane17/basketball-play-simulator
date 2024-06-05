// src/App.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Court from './components/Court';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Court />
      </div>
    </DndProvider>
  );
}

export default App;
