import Board from './Board';
import './App.css';
import React, { useState } from 'react';
import { Point } from './Board';

const App: React.FC = () => {
  const [black, setBlack] = useState<Point>([300, 400]);
  const [whites, setWhites] = useState<Point[]>([[280, 200], [320, 200]]);
  const [play, setPlay] = useState(false);

  return (
    <div className="app-root">
        <div className="app-center">
          <Board
            width={600}
            height={600}
            radius={15}
            black={black}
            whites={whites}
            play={play}
          ></Board>
          <button onClick={() => setPlay(true)}>Play</button>
        </div>
    </div>
  );
};

export default App;
