import React from 'react';
import DraggablePiece from './DraggablePiece';
import './Square.css';

const Square = ({
  position,
  squareColor,
  piece,
  isSelected,
  isLegalMove,
  isLastMove,
  onClick,
  onDragStart,
  onDragEnd,
  isCurrentPlayer,
}) => {
  // Create class names based on props
  const squareClasses = [
    'square',
    squareColor,
    isSelected ? 'selected' : '',
    isLegalMove ? 'valid-move' : '',
    isLastMove ? 'last-move' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={squareClasses} data-position={position} onClick={onClick}>
      {piece && (
        <DraggablePiece
          type={piece.type}
          color={piece.color}
          position={position}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isCurrentPlayer={
            isCurrentPlayer && piece.color === (isCurrentPlayer === 'w' ? 'white' : 'black')
          }
        />
      )}
    </div>
  );
};

export default Square;
