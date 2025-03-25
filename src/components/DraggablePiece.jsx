import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './Piece.css';

// Register the Draggable plugin
gsap.registerPlugin(Draggable);

// Unicode chess symbols - same as in Piece.jsx
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

const DraggablePiece = ({ type, color, position, onDragStart, onDragEnd, isCurrentPlayer }) => {
  const pieceRef = useRef(null);
  const draggableRef = useRef(null);

  // Add safety check for type and color
  if (!type || !color || !pieceSymbols[color] || !pieceSymbols[color][type]) {
    return null;
  }

  const symbol = pieceSymbols[color][type];

  useEffect(() => {
    // Only allow dragging if it's the current player's piece
    if (!isCurrentPlayer) return;

    // Create draggable instance
    draggableRef.current = Draggable.create(pieceRef.current, {
      type: 'x,y',
      bounds: '.board',
      onDragStart: () => {
        // Add a class for styling during drag
        pieceRef.current.classList.add('dragging');
        // Call the onDragStart callback with the position
        onDragStart(position);
      },
      onDragEnd: function () {
        // Remove the dragging class
        pieceRef.current.classList.remove('dragging');

        // Get the center position of the dragged piece
        const draggedPiece = pieceRef.current;
        const draggedRect = draggedPiece.getBoundingClientRect();
        const dragX = draggedRect.left + draggedRect.width / 2;
        const dragY = draggedRect.top + draggedRect.height / 2;

        // Reset position - we'll handle the actual move through state
        gsap.set(pieceRef.current, { x: 0, y: 0 });

        // Call the onDragEnd callback with the drag position
        onDragEnd(position, { x: dragX, y: dragY });
      },
    });

    return () => {
      // Clean up the draggable instance when the component unmounts
      if (draggableRef.current && draggableRef.current[0]) {
        draggableRef.current[0].kill();
      }
    };
  }, [position, isCurrentPlayer, onDragStart, onDragEnd]);

  return (
    <div
      ref={pieceRef}
      className={`piece ${type} ${color} ${isCurrentPlayer ? 'draggable' : ''}`}
      data-piece-type={type}
      data-piece-color={color}
      data-position={position}
    >
      {symbol}
    </div>
  );
};

export default DraggablePiece;
