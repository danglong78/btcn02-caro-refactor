/* eslint-disable default-case */
import Board from "../Board";
import React, { useState } from "react";

const Game = () => {
  const [xIsNext, setNextUser] = useState("true");
  const [stepNumber, setStepNumber] = useState(0);
  const [isAscending, setOrder] = useState(true);
  const [boardSize, setBoardSize] = useState(5);
  const [inputValue, setInput] = useState("");
  const [history, setHistory] = useState([
    { squares: Array(boardSize * boardSize).fill(null), position: null },
  ]);
  const handleClick = (index) => {
    console.log(stepNumber);
    let newHistory = history.slice(0, stepNumber + 1);
    let current = newHistory[newHistory.length - 1];
    let square = current.squares.slice();
    if (calculateResult(square).winner || square[index]) return;
    square[index] = xIsNext ? "X" : "O";
    setNextUser(!xIsNext);
    setHistory(newHistory.concat([{ squares: square, position: index }]));
    setStepNumber(stepNumber + 1);
  };

  let status;
  console.log(stepNumber);
  const currentHistory = history[stepNumber];

  const result = calculateResult(currentHistory.squares);
  if (result.winner) {
    status = "Winner: " + result.winner;
  } else {
    if (result.isDraw) status = "Draw";
    else status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setNextUser(step % 2 === 0);
  };

  const moves = history.map((step, move) => {
    const desc = move
      ? "Go to move #" +
        move +
        `: Position (${step.position % boardSize},${
          (step.position / boardSize) | 0
        })`
      : "Go to game start";
    return (
      <li key={move}>
        <button
          className={move === stepNumber ? "active-step" : null}
          onClick={() => jumpTo(move)}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div>
      <div className=".input-size">
        <input
          type="number"
          min="5"
          value={inputValue}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (inputValue >= 5 && inputValue <= 20) {
              setBoardSize(inputValue);
              setHistory([
                {
                  squares: Array(inputValue * inputValue).fill(null),
                  position: null,
                },
              ]);
              setStepNumber(0);
              setInput("");
            } else alert("Please input  value>=5 and value <=20");
          }}
        >
          {" "}
          Start
        </button>
      </div>
      <div className="game">
        <div className="game-board">
          <Board
            boardSize={boardSize}
            winLine={result.line}
            board={currentHistory.squares}
            onClick={(i) => {
              handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{isAscending ? moves : moves.reverse()}</ol>
        </div>
        <div>
          <button
            onClick={() => {
              setOrder(!isAscending);
            }}
          >
            {isAscending ? "descending" : "ascending"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;

function calculateResult(squares) {
  let boardSize = Math.sqrt(squares.length);

  let countChecked = 0;
  let countXO = [[], [], [], []]; //X vertical, O vertical, X horizontal, O horizontal
  //check horizontal and vertical
  for (let i = 0; i < boardSize; i++) {
    countXO[0] = [];
    countXO[1] = [];
    countXO[2] = [];
    countXO[3] = [];
    for (let j = 0; j < boardSize; j++) {
      let boxHorizontal = squares[i * boardSize + j];
      let boxVertical = squares[j * boardSize + i];
      if (boxHorizontal !== null) {
        countChecked++;
      }
      // check vertical row X and O
      switch (boxVertical) {
        case "X": {
          countXO[1] = [];
          countXO[0].push(j * boardSize + i);
          if (countXO[0].length === 5) {
            return {
              winner: "X",
              line: countXO[0],
              isDraw: false,
            };
          }
          break;
        }
        case "O": {
          countXO[0] = [];
          countXO[1].push(j * boardSize + i);
          if (countXO[1].length === 5) {
            return {
              winner: "O",
              line: countXO[1],
              isDraw: false,
            };
          }
          break;
        }
        case null: {
          countXO[1] = [];
          countXO[0] = [];
          break;
        }
      }
      // check horizontal row X and O
      switch (boxHorizontal) {
        case "X": {
          countXO[3] = [];
          countXO[2].push(i * boardSize + j);
          if (countXO[2].length === 5) {
            return {
              winner: "X",
              line: countXO[2],
              isDraw: false,
            };
          }
          break;
        }
        case "O": {
          countXO[2] = [];
          countXO[3].push(i * boardSize + j);
          if (countXO[3].length === 5) {
            return {
              winner: "O",
              line: countXO[3],
              isDraw: false,
            };
          }
          break;
        }
        case null: {
          countXO[3] = [];
          countXO[2] = [];
          break;
        }
      }
    }
  }

  if (countChecked === squares.length) {
    return {
      winner: null,
      line: null,
      isDraw: true,
    };
  }
  // check diagonal

  let countXDiagonal = [[], [], [], []];
  let countODiagonal = [[], [], [], []];
  for (let i = 0; i < boardSize; i++) {
    countXDiagonal[0] = [];
    countXDiagonal[1] = [];
    countXDiagonal[2] = [];
    countXDiagonal[3] = [];

    countODiagonal[0] = [];
    countODiagonal[1] = [];
    countODiagonal[2] = [];
    countODiagonal[3] = [];
    for (let j = 0; j < boardSize - i; j++) {
      let boxUpperLR = squares[j * boardSize + j + i];
      let boxUpperRL = squares[(boardSize - j - 1 - i) * boardSize + j];
      let boxLowerLR = squares[(j + i) * boardSize + j];
      let boxLowerRL = squares[(j + i) * boardSize + (boardSize - j - 1)];
      // check horizontal row X and O
      switch (boxUpperLR) {
        case "X": {
          countODiagonal[0] = [];
          countXDiagonal[0].push(j * boardSize + j + i);
          if (countXDiagonal[0].length === 5) {
            return {
              winner: "X",
              line: countXDiagonal[0],
              isDraw: false,
            };
          }
          break;
        }
        case "O": {
          countXDiagonal[0] = [];
          countODiagonal[0].push(j * boardSize + j + i);
          if (countODiagonal[0].length === 5) {
            return {
              winner: "O",
              line: countODiagonal[0],
              isDraw: false,
            };
          }
          break;
        }
        case null: {
          countXDiagonal[0] = [];
          countODiagonal[0] = [];
          break;
        }
      }
      //
      switch (boxLowerLR) {
        case "X": {
          countODiagonal[1] = [];
          countXDiagonal[1].push((j + i) * boardSize + j);
          if (countXDiagonal[1].length === 5) {
            return {
              winner: "X",
              line: countXDiagonal[1],
              isDraw: false,
            };
          }
          break;
        }
        case "O": {
          countXDiagonal[1] = [];
          countODiagonal[1].push((j + i) * boardSize + j);
          if (countODiagonal[1].length === 5) {
            return {
              winner: "O",
              line: countODiagonal[1],
              isDraw: false,
            };
          }
          break;
        }
        case null: {
          countODiagonal[1] = [];
          countXDiagonal[1] = [];
          break;
        }
      }
      //
      switch (boxUpperRL) {
        case "X": {
          countODiagonal[2] = [];
          countXDiagonal[2].push((boardSize - j - 1 - i) * boardSize + j);
          if (countXDiagonal[2].length === 5) {
            return {
              winner: "X",
              line: countXDiagonal[2],
              isDraw: false,
            };
          }
          break;
        }
        case "O": {
          countXDiagonal[2] = [];
          countODiagonal[2].push((boardSize - j - 1 - i) * boardSize + j);
          if (countODiagonal[2].length === 5) {
            return {
              winner: "O",
              line: countODiagonal[2],
              isDraw: false,
            };
          }
          break;
        }
        case null: {
          countODiagonal[2] = [];
          countXDiagonal[2] = [];
          break;
        }
      }
      //
      switch (boxLowerRL) {
        case "X": {
          countODiagonal[3] = [];
          countXDiagonal[3].push((j + i) * boardSize + (boardSize - j - 1));
          if (countXDiagonal[3].length === 5) {
            return {
              winner: "X",
              line: countXDiagonal[3],
              isDraw: false,
            };
          }
          break;
        }
        case "O": {
          countXDiagonal[3] = [];
          countODiagonal[3].push((j + i) * boardSize + (boardSize - j - 1));
          if (countODiagonal[3].length === 5) {
            return {
              winner: "O",
              line: countODiagonal[3],
              isDraw: false,
            };
          }
          break;
        }
        case null: {
          countODiagonal[3] = [];
          countXDiagonal[3] = [];
          break;
        }
      }
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: false,
  };
}
