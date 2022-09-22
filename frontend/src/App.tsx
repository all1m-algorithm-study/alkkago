import Board from './Board';
import './App.css';
import React from 'react';

const App: React.FC = () => {
  // for demo
  const stones = [
    {
      centerX: 300,
      centerY: 300,
      color: "black"
    },
    {
      centerX: 400,
      centerY: 200,
      color: "white"
    }
  ]

  return (
    <div className="app-root">
        <Board width={600} height={600} radius={15} stones={stones}></Board>
    </div>
  );
};

export default App;
