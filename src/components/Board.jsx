import React, { useRef } from 'react';
import { gsap } from 'gsap';
import Square from './Square';
import { useGameContext } from '../contexts/GameContext';
import './Board.css';

const Board = () => {
  const {
    board,
    selectedSquare,
    legalMoves,
    handleSquareClick,
    gameStatus,
    handlePieceMove,
    lastMove,
  } = useGameContext();

  const boardRef = useRef(null);

  // We'll organize our squares by rows and columns for clarity
  const renderBoard = () => {
    // Early return if board isn't populated yet
    if (!board || board.length === 0) {
      return null;
    }

    const rows = [];

    // Group squares by row (0 to 7, which corresponds to ranks 8 to 1)
    for (let row = 0; row < 8; row++) {
      const rowSquares = board.filter((square) => square.row === row);

      // Sort by column (0 to 7, which corresponds to files a to h)
      rowSquares.sort((a, b) => a.col - b.col);

      const squaresJsx = rowSquares.map((square) => {
        // Check if this square is part of the last move
        const isLastMoveFrom = lastMove && lastMove.from === square.position;
        const isLastMoveTo = lastMove && lastMove.to === square.position;
        const isLastMove = isLastMoveFrom || isLastMoveTo;

        return (
          <Square
            key={square.position}
            position={square.position}
            squareColor={square.squareColor}
            piece={square.piece}
            isSelected={square.position === selectedSquare}
            isLegalMove={legalMoves.includes(square.position)}
            isLastMove={isLastMove}
            onClick={() => handleSquareClick(square.position)}
            onDragStart={(pos) => handleDragStart(pos)}
            onDragEnd={(fromPos, point) => handleDragEnd(fromPos, point)}
            isCurrentPlayer={gameStatus.turn}
          />
        );
      });

      rows.push(
        <div key={`row-${row}`} className="board-row">
          {squaresJsx}
        </div>
      );
    }

    return rows;
  };

  // Handle drag start event
  const handleDragStart = (position) => {
    // Highlight legal moves for the piece
    handleSquareClick(position);
  };

  // Handle drag end event
  const handleDragEnd = (fromPosition, point) => {
    // Find the square at the drop position
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const squareSize = boardRect.width / 8;

    // Calculate which square the piece was dropped on
    const relativeX = point.x - boardRect.left;
    const relativeY = point.y - boardRect.top;

    const col = Math.floor(relativeX / squareSize);
    const row = Math.floor(relativeY / squareSize);

    // Convert to chess notation
    const toPosition = String.fromCharCode(97 + col) + (8 - row);

    // Make the move if legal
    if (legalMoves.includes(toPosition)) {
      handlePieceMove(fromPosition, toPosition);
    } else {
      // If the move is not legal, we'll animate the piece back
      // This is handled automatically as the state doesn't change
      // and the piece is re-rendered at its original position
    }
  };

  return (
    <div ref={boardRef} className="board">
      {renderBoard()}
    </div>
  );
};

export default Board;
