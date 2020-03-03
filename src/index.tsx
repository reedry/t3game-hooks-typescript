import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

type SquareValue = "X" | "O" | undefined;

const calculateWinner = (squares: SquareValue[]): SquareValue => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return undefined;
};

type SquareProps = {
  value: SquareValue;
  onClick: () => void;
};

const Square: React.FC<SquareProps> = props => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

type BoardProps = {
  squares: SquareValue[];
  onClick: (i: number) => void;
};
const Board: React.FC<BoardProps> = props => {
  const renderSquare = (i: number) => {
    return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

type History = {
  squares: SquareValue[];
}[];

const Game: React.FC = () => {
  const [history, setHistory] = useState<History>([
    {
      squares: Array(9).fill(undefined)
    }
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setTurn] = useState(true);
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const jumpTo = (step: number) => {
    setStepNumber(step);
    setTurn(step % 2 === 0);
  };

  const moves = history.map((_, step) => {
    const desc = step ? "Go to move #" + step : "Go to game start";
    return (
      <li key={step}>
        <button onClick={() => jumpTo(step)}>{desc}</button>
      </li>
    );
  });
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const handleClick = (i: number) => {
    const historyCopy = history.slice(0, stepNumber + 1);
    const current = historyCopy[historyCopy.length - 1];
    const winner = calculateWinner(current.squares);
    const squaresCopy = current.squares.slice();
    if (winner || current.squares[i]) {
      return;
    }
    squaresCopy[i] = xIsNext ? "X" : "O";
    setHistory(historyCopy.concat([{ squares: squaresCopy }]));
    setStepNumber(historyCopy.length);
    setTurn(!xIsNext);
  };
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={i => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
