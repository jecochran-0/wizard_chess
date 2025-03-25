import React, { useState } from 'react';
import { useGameContext } from '../contexts/GameContext';
import './GameAnalysis.css';

const GameAnalysis = () => {
  const { game, exportPGN, exportFEN, resetToPosition } = useGameContext();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pgn');
  const [exportedText, setExportedText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    let text = '';
    if (exportFormat === 'pgn') {
      text = exportPGN();
    } else if (exportFormat === 'fen') {
      text = exportFEN();
    }
    setExportedText(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="game-analysis">
      <button className="analysis-toggle" onClick={() => setAnalysisOpen(!analysisOpen)}>
        {analysisOpen ? 'Hide Analysis Tools' : 'Show Analysis Tools'}
      </button>

      {analysisOpen && (
        <div className="analysis-panel">
          <div className="panel-section">
            <h4>Export Game</h4>
            <div className="export-controls">
              <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                <option value="pgn">PGN Format</option>
                <option value="fen">FEN Format</option>
              </select>
              <button onClick={handleExport}>Export</button>
            </div>

            {exportedText && (
              <div className="export-result">
                <textarea value={exportedText} readOnly />
                <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy to Clipboard'}</button>
              </div>
            )}
          </div>

          <div className="panel-section">
            <h4>Board Controls</h4>
            <div className="board-controls">
              <button onClick={() => resetToPosition(0)}>Start Position</button>
              <button onClick={() => resetToPosition(-1)}>Current Position</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameAnalysis;
