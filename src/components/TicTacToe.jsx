import React, { useState, useRef } from 'react';
import "./TicTacToe.css";
import circle_icon from "../assets/circle.png"; 
import cross_icon from "../assets/cross.png"; 

let data = ["", "", "", "", "", "", "", "", ""];

const TicTacToe = () => {
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [winner, setWinner] = useState(null);
  const titleRef = useRef(null);

  const toggle = (e, num) => {
    if (lock || data[num] !== "") {
      return;
    }

    if (count % 2 === 0) {
      data[num] = "x";
      e.target.innerHTML = `<img src='${cross_icon}'>`;
    } else {
      data[num] = "o";
      e.target.innerHTML = `<img src='${circle_icon}'>`;
    }

    setCount(count + 1);
    checkWin();
  };

  const checkWin = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (data[a] && data[a] === data[b] && data[b] === data[c]) {
        won(data[a]);
        return;
      }
    }

    if (data.every(cell => cell !== "")) {
      setWinner("draw");
      setLock(true);
      titleRef.current.innerHTML = `It's a Draw!`;
    }
  };

  const won = (player) => {
    setLock(true);
    setWinner(player);
    if (player === "x") {
      titleRef.current.innerHTML = `Congratulations! Player X Wins! <img src='${cross_icon}' />`;
    } else {
      titleRef.current.innerHTML = `Congratulations! Player O Wins! <img src='${circle_icon}' />`;
    }
  };

  const resetGame = () => {
    data = ["", "", "", "", "", "", "", "", ""];
    setCount(0);
    setLock(false);
    setWinner(null);
    titleRef.current.innerHTML = "Tic Tac Toe In React";
    document.querySelectorAll('.boxes').forEach(box => {
      box.innerHTML = "";
    });
  };

  return (
    <div className="container">
      <h1 className="title" ref={titleRef}>Tic Tac Toe In <span>React</span></h1>
      <div className="board">
        <div className="row1">
          <div className="boxes" onClick={(e) => toggle(e, 0)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 1)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 2)}></div>
        </div>
        <div className="row2">
          <div className="boxes" onClick={(e) => toggle(e, 3)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 4)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 5)}></div>
        </div>
        <div className="row3">
          <div className="boxes" onClick={(e) => toggle(e, 6)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 7)}></div>
          <div className="boxes" onClick={(e) => toggle(e, 8)}></div>
        </div>
      </div>
      <button className="reset" onClick={resetGame}>Reset</button>
    </div>
  );
};

export default TicTacToe;
