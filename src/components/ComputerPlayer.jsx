import React, { useEffect, useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import './ComputerPlayer.css';

const ComputerPlayer = () => {
  const { isComputerPlayer, toggleComputerPlayer, computerDifficulty, setComputerDifficulty } =
    useGameContext();

  const difficultyLabels = {
    1: 'Beginner',
    5: 'Easy',
    10: 'Medium',
    15: 'Hard',
    20: 'Expert',
  };

  const handleDifficultyChange = (e) => {
    setComputerDifficulty(Number(e.target.value));
  };

  return (
    <div className="computer-player">
      <div className="toggle-container">
        <label htmlFor="computer-toggle">Play against computer</label>
        <label className="switch">
          <input
            id="computer-toggle"
            type="checkbox"
            checked={isComputerPlayer}
            onChange={toggleComputerPlayer}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {isComputerPlayer && (
        <div className="difficulty-container">
          <label htmlFor="difficulty-slider">
            Computer difficulty:{' '}
            <span>{difficultyLabels[computerDifficulty] || computerDifficulty}</span>
          </label>
          <input
            id="difficulty-slider"
            type="range"
            min="1"
            max="20"
            step="1"
            value={computerDifficulty}
            onChange={handleDifficultyChange}
            className="difficulty-slider"
          />
          <div className="difficulty-labels">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerPlayer;
