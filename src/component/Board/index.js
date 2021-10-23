import Square from "../Square";
import React from "react";

const Board = (props) => {
  const winLine = props.winLine;
  const renderSquare = (index) => {
    return (
      <Square
        key={index}
        value={props.board[index]}
        onClick={() => props.onClick(index)}
        winLine={winLine && winLine.includes(index)}
      />
    );
  };

  let squares = [];
  for (let i = 0; i < props.boardSize; ++i) {
    let row = [];
    for (let j = 0; j < props.boardSize; ++j) {
      row.push(renderSquare(i * props.boardSize + j));
    }
    squares.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return <div>{squares}</div>;
};

export default Board;
