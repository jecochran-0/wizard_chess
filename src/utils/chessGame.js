// Chess game utility functions using chess.js
import { Chess } from 'chess.js';

export const createGame = () => {
  return new Chess();
};

export const isValidMove = (game, from, to) => {
  try {
    const move = game.move({
      from,
      to,
      promotion: 'q' // Always promote to queen for simplicity
    });
    
    if (move) {
      // Undo the move to keep the game state unchanged
      game.undo();
      return true;
    }
    
    return false;
  } catch (e) {
    return false;
  }
};

export const getGameStatus = (game) => {
  if (game.isCheckmate()) return 'checkmate';
  if (game.isDraw()) return 'draw';
  if (game.isStalemate()) return 'stalemate';
  if (game.isCheck()) return 'check';
  return 'active';
};

export const getLegalMoves = (game, square) => {
  if (!square) return [];
  
  return game.moves({
    square,
    verbose: true
  });
}; 