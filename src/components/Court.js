// src/components/Court.js
import React from 'react';
import './Court.css';

const Court = () => {
  return (
    <div className="court">
      <div className="half-court">
        <div className="center-circle"></div>
        <div className="free-throw-circle"></div>
        <div className="three-point-line"></div>
        <div className="key"></div>
        <div className="basket"></div>
        <div className="backboard"></div>
      </div>
    </div>
  );
};

export default Court;
