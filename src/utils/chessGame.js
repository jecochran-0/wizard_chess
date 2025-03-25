// Chess game utility functions using chess.js
import { Chess } from 'chess.js';

/**
 * Creates a new chess game instance
 * @param {string} [fen] - Optional FEN string to initialize the board
 * @returns {Chess} A new Chess.js instance
 */
export const createGame = (fen) => {
  return new Chess(fen);
};

/**
 * Validates if a move is legal without changing the game state
 * @param {Chess} game - Chess.js game instance
 * @param {string} from - Starting square (e.g., 'e2')
 * @param {string} to - Target square (e.g., 'e4')
 * @returns {boolean} Whether the move is legal
 */
export const isValidMove = (game, from, to) => {
  try {
    // Try to create a move object
    const moveObj = {
      from,
      to,
      promotion: 'q', // Default to queen for pawn promotion
    };

    // Check if the move is valid
    return game.isLegal(moveObj);
  } catch (e) {
    return false;
  }
};

/**
 * Gets the current game status
 * @param {Chess} game - Chess.js game instance
 * @returns {Object} Game status information
 */
export const getGameStatus = (game) => {
  return {
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    turn: game.turn(), // 'w' or 'b'
  };
};

/**
 * Get all legal moves for a piece on a specific square
 * @param {Chess} game - Chess.js game instance
 * @param {string} square - Square to get moves for (e.g., 'e2')
 * @returns {Array} Array of target squares the piece can move to
 */
export const getLegalMoves = (game, square) => {
  try {
    // Get all legal moves in the game
    const moves = game.moves({ square, verbose: true });
    // Return just the target squares
    return moves.map((move) => move.to);
  } catch (e) {
    return [];
  }
};

/**
 * Make a move on the chess board
 * @param {Chess} game - Chess.js game instance
 * @param {string} from - Starting square
 * @param {string} to - Target square
 * @param {string} [promotion] - Piece to promote to (q, r, b, n)
 * @returns {Object|null} The move object if successful, null if failed
 */
export const makeMove = (game, from, to, promotion = 'q') => {
  try {
    const moveObj = {
      from,
      to,
      promotion,
    };

    return game.move(moveObj);
  } catch (e) {
    return null;
  }
};

/**
 * Get piece at a specific position
 * @param {Chess} game - Chess.js game instance
 * @param {string} square - Square to check (e.g., 'e2')
 * @returns {Object|null} Piece object or null if empty
 */
export const getPieceAt = (game, square) => {
  return game.get(square);
};
