import './App.css';
import React, { Fragment, useState } from 'react';
import { PIECE_RADIUS, Point } from './shared/boardSetting';
import BoardEditor from './BoardEditor';
import BoardViewer from './BoardViewer';

type CircleRelation = {
  noRelation: Point[],
  metOuter: Point[],         // R < dist <= 2*R
  metInner: Point[],         // dist <= R
};

function getDist(p: Point, q: Point): number {
  return Math.sqrt(Math.pow(p[0]-q[0], 2) + Math.pow(p[1]-q[1], 2));
}

function mapCircles(pivotCenter: Point, centers: Point[]): CircleRelation {
  const result: CircleRelation = {
    noRelation: [],
    metOuter: [],
    metInner: [],
  };
  centers.forEach(center => {
    const dist = getDist(center, pivotCenter);
    if (dist <= PIECE_RADIUS) {
      result.metInner.push(center);
    } else if (dist <= 2*PIECE_RADIUS) {
      result.metOuter.push(center);
    } else {
      result.noRelation.push(center);
    }
  });
  return result;
}

const App: React.FC = () => {
  const [black, setBlack] = useState<Point | null>([300, 400]);
  const [whites, setWhites] = useState<Point[]>([[280, 200], [320, 200]]);
  const [selected, setSelected] = useState<string>("black");
  const [message, setMessage] = useState<string>("보드 위의 돌을 클릭하면 돌이 삭제됩니다.");
  const [editMode, setEditMode] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(4);
  const [play, setPlay] = useState<boolean>(true);

  function handleClick(p: Point) {
    if (black && mapCircles(p, [black]).metInner.length) {
      setBlack(null);
      setMessage("선택한 검은 돌을 제거합니다.");
      return;
    }
    const wRels = mapCircles(p, whites);
    if (wRels.metInner.length) {
      setWhites(wRels.noRelation.concat(wRels.metOuter));
      setMessage("선택한 흰 돌을 제거합니다.");
      return;
    }

    if ((selected !== "black" && black && mapCircles(p, [black]).metOuter.length) ||
        wRels.metOuter.length) {
      // has conflict
      setMessage("위치에 인접한 다른 돌이 있어, 돌을 놓을 수 없습니다.");
      return;
    }

    if (selected === "black") {
      setMessage("검은 돌의 위치를 변경하였습니다.");
      setBlack(p);
    } else {
      setMessage("흰 돌을 추가하였습니다.");
      setWhites([...whites, p]);
    }
  }

  function handleRadioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelected(e.target.value);
  }

  function handleModeSwitch() {
    if (!!!black) {
      alert("검은 돌이 존재하지 않습니다.");
      return;
    }
    if (whites.length === 0) {
      alert("흰 돌이 존재하지 않습니다.");
      return;
    }
    setEditMode(!editMode);
  }

  function handleSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSpeed(Number(e.target.value));
  }

  return (
    <div className="app-root">
        <div className="app-center">
          {editMode ? (
            <Fragment>
              <BoardEditor
                black={black}
                whites={whites}
                onClick={handleClick}
              ></BoardEditor>

              <span>{message}</span>

              <div className="app-radio">
                <label>
                  <input
                    type="radio"
                    value="black"
                    onChange={handleRadioChange}
                    checked={selected === "black"}>
                  </input>
                  검은 돌의 위치 바꾸기
                </label>
                <label>
                  <input
                    type="radio"
                    value="white"
                    onChange={handleRadioChange}
                    checked={selected === "white"}>
                  </input>
                  흰 돌 추가하기
                </label>
              </div>

              <button onClick={handleModeSwitch}>시뮬레이션 보기</button>
            </Fragment>
          ) : (
            <Fragment>
              <BoardViewer
                black={black as Point}
                whites={whites}
                speed={play ? speed : 0}
              ></BoardViewer>

              <button onClick={handleModeSwitch}>편집 모드로 돌아가기</button>

              <label>재생속도</label>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={handleSpeedChange}>
              </input>

              <button onClick={() => setPlay((v) => !v)}>{play ? "일시정지" : "재생"}</button>
            </Fragment>
          )}
        </div>
    </div>
  );
};

export default App;
