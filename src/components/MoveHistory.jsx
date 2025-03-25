import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import './MoveHistory.css';

const MoveHistory = () => {
  const { moveHistory, handleHistoryClick, currentViewingIndex } = useGameContext();

  // Format move with algebraic notation
  const formatMove = (move, index) => {
    // Get move number (each move has white and black, so divide by 2 and add 1)
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;

    // Format move in standard chess notation
    let formattedMove = move.san;

    // Add check or checkmate symbol if present
    if (formattedMove.includes('+')) {
      formattedMove = formattedMove.replace('+', '†');
    } else if (formattedMove.includes('#')) {
      formattedMove = formattedMove.replace('#', '‡');
    }

    return (
      <span
        key={index}
        className={`move ${currentViewingIndex === index ? 'current' : ''}`}
        onClick={() => handleHistoryClick(index)}
      >
        {isWhiteMove && <span className="move-number">{moveNumber}.</span>}
        <span className={`move-text ${isWhiteMove ? 'white' : 'black'}`}>{formattedMove}</span>
      </span>
    );
  };

  return (
    <div className="move-history">
      <h3>Move History</h3>
      <div className="moves-container">
        {moveHistory.length === 0 ? (
          <p className="no-moves">No moves yet</p>
        ) : (
          moveHistory.map((move, index) => formatMove(move, index))
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
