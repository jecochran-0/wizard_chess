import { useState } from 'react';
// Import commented out until we re-add Firebase
// import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    // Removed AuthProvider wrapping until Firebase is added back
    <div className="App">
      <header className="App-header">
        <h1>Wizard's Chess</h1>
        <p>React app setup complete!</p>
        <p>
          <button onClick={() => setCount((count) => count + 1)}>
            Test React: count is {count}
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;
