import React from 'react';
import { GameProvider } from './contexts/GameContext';
import Board from './components/Board';
import GameControls from './components/GameControls';
import ComputerPlayer from './components/ComputerPlayer';
import MoveHistory from './components/MoveHistory';
import GameAnalysis from './components/GameAnalysis';
import './App.css';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <header className="App-header">
          <h1>Wizard's Chess</h1>
        </header>
        <main>
          <Board />
          <GameControls />
          <MoveHistory />
          <ComputerPlayer />
          <GameAnalysis />
        </main>
        <footer className="App-footer">
          <p>Created with React and Chess.js</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;
