import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import './GameControls.css';

const GameControls = () => {
  const { resetGame, undoMove, gameStatus, moveHistory, isComputerThinking, isComputerPlayer } =
    useGameContext();

  // Format the game status for display
  const getStatusMessage = () => {
    if (gameStatus.isCheckmate) {
      return `Checkmate! ${gameStatus.turn === 'w' ? 'Black' : 'White'} wins!`;
    } else if (gameStatus.isStalemate) {
      return 'Stalemate - Game is a draw';
    } else if (gameStatus.isDraw) {
      return 'Draw';
    } else if (gameStatus.isCheck) {
      return `Check! ${gameStatus.turn === 'w' ? 'White' : 'Black'} to move`;
    }

    if (isComputerPlayer && gameStatus.turn === 'b') {
      return isComputerThinking ? 'Computer is thinking...' : 'Computer to move';
    }

    return `${gameStatus.turn === 'w' ? 'White' : 'Black'}'s turn`;
  };

  return (
    <div className="game-controls">
      <div className="game-status">
        <p
          className={`status ${gameStatus.isCheck ? 'check' : ''} ${gameStatus.isCheckmate ? 'checkmate' : ''} ${gameStatus.isStalemate || gameStatus.isDraw ? 'draw' : ''} ${isComputerThinking ? 'thinking' : ''}`}
        >
          {getStatusMessage()}
        </p>
      </div>

      <div className="game-info">
        <p>Moves: {moveHistory.length}</p>
      </div>

      <div className="control-buttons">
        <button onClick={undoMove} disabled={moveHistory.length === 0 || isComputerThinking}>
          Undo Move
        </button>
        <button onClick={resetGame} disabled={isComputerThinking}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default GameControls;
