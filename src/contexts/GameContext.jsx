import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { createGame, getLegalMoves, makeMove, getGameStatus } from '../utils/chessGame';
import { getStockfishEngine } from '../utils/stockfishEngine';

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [gameStatus, setGameStatus] = useState({});
  const [moveHistory, setMoveHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [isComputerPlayer, setIsComputerPlayer] = useState(false);
  const [computerDifficulty, setComputerDifficulty] = useState(10);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const [gamePositions, setGamePositions] = useState([]);
  const [currentViewingIndex, setCurrentViewingIndex] = useState(-1);
  const [isReviewing, setIsReviewing] = useState(false);

  // Initialize the game
  useEffect(() => {
    const newGame = createGame();
    setGame(newGame);
    updateBoardState(newGame);

    // Initialize game positions with the starting position
    setGamePositions([
      {
        fen: newGame.fen(),
        board: convertBoardToState(newGame.board()),
      },
    ]);
  }, []);

  // Set up Stockfish when computer player is enabled
  useEffect(() => {
    if (isComputerPlayer) {
      const engine = getStockfishEngine();
      engine.setSkillLevel(computerDifficulty);
    }
  }, [isComputerPlayer, computerDifficulty]);

  // Make the computer move when it's the computer's turn
  useEffect(() => {
    if (!game || !isComputerPlayer || isComputerThinking) return;

    // Check if it's black's turn (computer plays as black)
    if (game.turn() === 'b') {
      makeComputerMove();
    }
  }, [game, isComputerPlayer, gameStatus]);

  // Make a move as the computer
  const makeComputerMove = useCallback(() => {
    if (!game) return;

    setIsComputerThinking(true);

    // Get the current FEN
    const fen = game.fen();

    // Ask Stockfish for the best move
    const engine = getStockfishEngine();

    // Slight delay for better UX - makes it feel more natural
    setTimeout(() => {
      engine.findBestMove(fen, (bestMove) => {
        if (bestMove && bestMove.length >= 4) {
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);

          // Make the computer's move
          handlePieceMove(from, to);
          setIsComputerThinking(false);
        }
      });
    }, 500);
  }, [game]);

  // Update game state when a piece is selected
  useEffect(() => {
    if (!game || !selectedSquare) {
      setLegalMoves([]);
      return;
    }

    const moves = getLegalMoves(game, selectedSquare);
    setLegalMoves(moves);
  }, [game, selectedSquare]);

  // Toggle computer player on/off
  const toggleComputerPlayer = () => {
    // Reset the game when toggling computer player
    const newIsComputer = !isComputerPlayer;
    setIsComputerPlayer(newIsComputer);

    // Reset the game
    resetGame();
  };

  // Update board state from chess.js
  const updateBoardState = (gameInstance) => {
    if (!gameInstance) return;

    // Convert chess.js board to our format
    const newBoard = [];
    const boardArray = gameInstance.board();

    // Loop through each row and column of the chess.js board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // Chess.js uses 0-7 for rows and cols, but displays black at the top
        // So row 0 is rank 8, and column 0 is file a
        const position = String.fromCharCode(97 + col) + (8 - row);
        const squareColor = (row + col) % 2 === 0 ? 'light' : 'dark';
        const piece = boardArray[row][col];

        newBoard.push({
          position,
          squareColor,
          piece: piece
            ? {
                type: piece.type,
                color: piece.color === 'w' ? 'white' : 'black',
              }
            : null,
          row, // Store the row index
          col, // Store the column index
        });
      }
    }

    setBoard(newBoard);
    setGameStatus(getGameStatus(gameInstance));

    // For debugging purposes
    if (newBoard.length === 0) {
      console.error('Board generation failed - no squares created');
    }

    if (newBoard.length < 64) {
      console.error(`Board incomplete - only ${newBoard.length} squares created`);
    }
  };

  // Handle square click
  const handleSquareClick = (position) => {
    // If no game is active, do nothing
    if (!game) return;

    // If computer is thinking, do nothing
    if (isComputerThinking) return;

    // If it's computer's turn (black) and computer player is enabled, do nothing
    if (isComputerPlayer && game.turn() === 'b') return;

    // If no square is currently selected
    if (!selectedSquare) {
      // Check if the clicked square has a piece of the current player's color
      const piece = game.get(position);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(position);
      }
    }
    // If a square is already selected
    else {
      // If the same square is clicked again, deselect it
      if (position === selectedSquare) {
        setSelectedSquare(null);
        return;
      }

      // Check if the clicked square is in legal moves
      if (legalMoves.includes(position)) {
        // Make the move with animation
        handlePieceMove(selectedSquare, position);
      } else {
        // If clicking on another own piece, select that piece instead
        const piece = game.get(position);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(position);
        } else {
          // Clear selection if clicking elsewhere
          setSelectedSquare(null);
        }
      }
    }
  };

  // Handle piece movement with animation
  const handlePieceMove = (fromPosition, toPosition) => {
    if (!game) return;

    // Don't allow moves when reviewing past positions
    if (isReviewing) {
      resetToPosition(-1); // Reset to current position
      return;
    }

    // Make the move
    const moveResult = makeMove(game, fromPosition, toPosition);

    if (moveResult) {
      // Update move history
      const newHistory = [...moveHistory, moveResult];
      setMoveHistory(newHistory);

      // Set last move for highlighting
      setLastMove({ from: fromPosition, to: toPosition });

      // Add this position to game positions
      const newPositions = [...gamePositions];
      newPositions.push({
        fen: game.fen(),
        board: convertBoardToState(game.board()),
      });
      setGamePositions(newPositions);

      // Clear selection
      setSelectedSquare(null);

      // Update board state
      updateBoardState(game);

      // Play move sound
      playMoveSound(moveResult);
    }
  };

  // Play sound for different types of moves
  const playMoveSound = (moveResult) => {
    // Sound file paths
    const soundPaths = {
      capture: '/sounds/capture.mp3',
      castle: '/sounds/castle.mp3',
      promote: '/sounds/promote.mp3',
      regular: '/sounds/move.mp3',
    };

    let soundPath;

    // Determine the type of move to play appropriate sound
    if (moveResult.flags.includes('c')) {
      // Capture sound
      soundPath = soundPaths.capture;
    } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
      // Castling sound
      soundPath = soundPaths.castle;
    } else if (moveResult.flags.includes('p')) {
      // Promotion sound
      soundPath = soundPaths.promote;
    } else {
      // Regular move sound
      soundPath = soundPaths.regular;
    }

    // Check if file exists before playing
    fetch(soundPath)
      .then((response) => {
        if (response.ok) {
          const audio = new Audio(soundPath);
          return audio.play();
        } else {
          console.log(`Sound file not found: ${soundPath}`);
        }
      })
      .catch((e) => console.log('Error playing sound:', e));
  };

  // Reset the game
  const resetGame = () => {
    const newGame = createGame();
    setGame(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setLastMove(null);
    setIsComputerThinking(false);
    setIsReviewing(false);
    setCurrentViewingIndex(-1);

    // Reset positions to just the starting position
    setGamePositions([
      {
        fen: newGame.fen(),
        board: convertBoardToState(newGame.board()),
      },
    ]);

    updateBoardState(newGame);
  };

  // Undo the last move
  const undoMove = () => {
    if (!game || moveHistory.length === 0) return;

    // If playing against computer, undo both computer and player moves
    if (isComputerPlayer && moveHistory.length > 1) {
      game.undo(); // Undo computer move
      game.undo(); // Undo player move
      const newHistory = moveHistory.slice(0, -2);
      setMoveHistory(newHistory);

      // Update last move highlighting
      const previousMove = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
      setLastMove(previousMove ? { from: previousMove.from, to: previousMove.to } : null);
    } else {
      // Regular undo for human vs human
      game.undo();
      const newHistory = moveHistory.slice(0, -1);
      setMoveHistory(newHistory);

      // Update last move highlighting
      const previousMove = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
      setLastMove(previousMove ? { from: previousMove.from, to: previousMove.to } : null);
    }

    updateBoardState(game);
    setSelectedSquare(null);
  };

  // New function to handle clicking on a move in the history
  const handleHistoryClick = (index) => {
    if (index < 0 || index >= gamePositions.length - 1) return;

    setCurrentViewingIndex(index);
    setIsReviewing(true);

    // Show the board after this move was played
    const position = gamePositions[index + 1]; // +1 because first position is the initial board

    // Create a new game from this position's FEN
    const tempGame = createGame(position.fen);

    // Update the visual board (but don't change the actual game)
    setBoard(position.board);

    // Update the game status based on this position
    setGameStatus(getGameStatus(tempGame));

    // Clear selections
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  // Function to reset to a specific position
  const resetToPosition = (index) => {
    if (index === -1) {
      // Reset to current game state
      setIsReviewing(false);
      setCurrentViewingIndex(-1);
      updateBoardState(game);
    } else if (index === 0) {
      // Reset to start position
      setIsReviewing(true);
      setCurrentViewingIndex(-1);

      const startPosition = gamePositions[0];
      setBoard(startPosition.board);

      // Create temp game for status
      const tempGame = createGame(startPosition.fen);
      setGameStatus(getGameStatus(tempGame));

      // Clear selections
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  // Convert chess.js board to our state format
  const convertBoardToState = (boardArray) => {
    const newBoard = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const position = String.fromCharCode(97 + col) + (8 - row);
        const squareColor = (row + col) % 2 === 0 ? 'light' : 'dark';
        const piece = boardArray[row][col];

        newBoard.push({
          position,
          squareColor,
          piece: piece
            ? {
                type: piece.type,
                color: piece.color === 'w' ? 'white' : 'black',
              }
            : null,
          row,
          col,
        });
      }
    }

    return newBoard;
  };

  // Export game as PGN
  const exportPGN = () => {
    if (!game) return '';
    return game.pgn();
  };

  // Export current position as FEN
  const exportFEN = () => {
    if (!game) return '';
    return game.fen();
  };

  const value = {
    game,
    board,
    selectedSquare,
    legalMoves,
    gameStatus,
    moveHistory,
    lastMove,
    isComputerPlayer,
    computerDifficulty,
    isComputerThinking,
    isReviewing,
    currentViewingIndex,
    handleSquareClick,
    handlePieceMove,
    resetGame,
    undoMove,
    toggleComputerPlayer,
    setComputerDifficulty,
    handleHistoryClick,
    resetToPosition,
    exportPGN,
    exportFEN,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
