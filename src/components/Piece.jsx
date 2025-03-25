import React from 'react';
import './Piece.css';

// Unicode chess symbols
const pieceSymbols = {
  white: {
    p: '♙', // pawn
    n: '♘', // knight
    b: '♗', // bishop
    r: '♖', // rook
    q: '♕', // queen
    k: '♔', // king
  },
  black: {
    p: '♟', // pawn
    n: '♞', // knight
    b: '♝', // bishop
    r: '♜', // rook
    q: '♛', // queen
    k: '♚', // king
  },
};

const Piece = ({ type, color }) => {
  // Add safety check to prevent errors when type or color is undefined
  if (!type || !color || !pieceSymbols[color] || !pieceSymbols[color][type]) {
    console.error(`Invalid piece: type=${type}, color=${color}`);
    return null;
  }

  const symbol = pieceSymbols[color][type];

  return (
    <div className={`piece ${type} ${color}`} data-piece-type={type} data-piece-color={color}>
      {symbol}
    </div>
  );
};

export default Piece;
