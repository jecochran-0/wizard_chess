# Architecture Overview

## File Structure

- `/src`: Contains all source code
  - `/components`: React components
    - `Board.jsx`: Renders the chess board grid
    - `Square.jsx`: Renders individual board squares
    - `Piece.jsx`: Renders chess pieces with appropriate styling
  - `/contexts`: React context providers
  - `/hooks`: Custom React hooks
  - `/services`: Service modules for external interactions
  - `/utils`: Utility functions
  - `/assets`: Static assets (images, etc.)

## Key Files

### Source Files

- `src/main.jsx`: The entry point of the application
- `src/App.jsx`: The root component of the application
- `src/index.css`: Global styles
- `src/App.css`: App-specific styles

### Component Files

- `src/components/Board.jsx`: Creates and manages the chess board
  - Renders the 8x8 grid of squares
  - Positions pieces on the board
  - Handles board-level interactions
- `src/components/Square.jsx`: Represents a square on the chess board
  - Renders with the appropriate color (light/dark)
  - Contains piece components when pieces are present
  - Stores position data (e.g., "e4", "a1")
- `src/components/Piece.jsx`: Represents chess pieces
  - Uses Unicode symbols for chess piece representation
  - Applies appropriate styling based on piece type and color
  - Contains piece-specific data attributes

### Component CSS Files

- `src/components/Board.css`: Styling for the chess board component
  - Grid layout for the 8x8 board
  - Responsive sizing
  - Border and shadow styling
- `src/components/Square.css`: Styling for square components
  - Light and dark square colors
  - Hover and selection styling
  - Position indicators
- `src/components/Piece.css`: Styling for chess pieces
  - Size and appearance of pieces
  - Color differentiation between white and black pieces
  - Animation-ready styling

### Utility Files

- `src/utils/chessGame.js`: Chess game utilities using chess.js
  - `createGame()`: Creates a new Chess.js instance
  - `isValidMove()`: Validates if a move is legal without changing game state
  - `getGameStatus()`: Returns the current game status (checkmate, draw, etc.)
  - `getLegalMoves()`: Gets all legal moves for a piece on a specific square

### Service Files

- `src/services/socketService.js`: Handles real-time multiplayer via Socket.IO
  - `initSocket()`: Creates and initializes a Socket.IO connection
  - `getSocket()`: Returns the current socket instance
  - `disconnectSocket()`: Closes the socket connection

### Context Files

- `src/contexts/AuthContext.jsx`: (Temporarily removed) Will provide authentication state

## Data Flow

1. Game state is managed by Chess.js through the utilities in `chessGame.js`
2. React components render based on this game state
3. User interactions trigger game state updates
4. For multiplayer, state changes are synchronized via Socket.IO

## Technology Stack

- **Framework**: React (via Vite)
- **Game Logic**: chess.js
- **Animations**: GSAP
- **AI**: Stockfish
- **Multiplayer**: Socket.IO
- **Authentication**: Firebase (to be added)
