import React, { useState, useRef, useEffect } from 'react';
import './TicTacToe.css';

const cross = (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <line x1="20" y1="20" x2="60" y2="60" stroke="white" strokeWidth="4"/>
    <line x1="60" y1="20" x2="20" y2="60" stroke="white" strokeWidth="4"/>
  </svg>
);

const circle = (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="20" stroke="white" strokeWidth="4" fill="none"/>
  </svg>
);

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!lock && !aiThinking && count % 2 === 1) {
      aiMove();
    }
  }, [count]);

  const toggle = (num) => {
    if (lock || board[num] !== '' || aiThinking) return;

    const newBoard = [...board];
    newBoard[num] = 'x';
    setBoard(newBoard);
    setCount(count + 1);
    checkWin(newBoard);
  };

  const aiMove = () => {
    setAiThinking(true);
    setTimeout(() => {
      const bestMove = getBestMove([...board]);
      if (bestMove !== -1) {
        const newBoard = [...board];
        newBoard[bestMove] = 'o';
        setBoard(newBoard);
        setCount(count + 1);
        checkWin(newBoard);
      }
      setAiThinking(false);
    }, 500);
  };

  const checkWin = (currentBoard) => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c]) {
        won(currentBoard[a]);
        return true;
      }
    }

    if (currentBoard.every(cell => cell !== '')) {
      setLock(true);
      titleRef.current.innerHTML = "It's a Draw!";
      return true;
    }

    return false;
  };

  const won = (winner) => {
    setLock(true);
    titleRef.current.innerHTML = `Congratulations! Player ${winner.toUpperCase()} Wins!`;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setCount(0);
    setLock(false);
    setAiThinking(false);
    titleRef.current.innerHTML = 'Tic Tac Toe In <span>React</span>';
  };

  const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === 'o') return 10 - depth;
    if (winner === 'x') return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      board.forEach((cell, index) => {
        if (cell === '') {
          board[index] = 'o';
          best = Math.max(best, minimax(board, depth + 1, false));
          board[index] = '';
        }
      });
      return best;
    }
    
    let best = Infinity;
    board.forEach((cell, index) => {
      if (cell === '') {
        board[index] = 'x';
        best = Math.min(best, minimax(board, depth + 1, true));
        board[index] = '';
      }
    });
    return best;
  };

  const getBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    board.forEach((cell, index) => {
      if (cell === '') {
        board[index] = 'o';
        const moveVal = minimax(board, 0, false);
        board[index] = '';
        if (moveVal > bestVal) {
          bestMove = index;
          bestVal = moveVal;
        }
      }
    });

    return bestMove;
  };

  const checkWinner = (board) => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  return (
    <div className="container">
      <h1 className="title" ref={titleRef}>
        Tic Tac Toe In <span>React</span>
      </h1>
      <div className="board">
        <div>
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ display: 'flex' }}>
              {[0, 1, 2].map((col) => {
                const index = row * 3 + col;
                return (
                  <div
                    key={index}
                    className="boxes"
                    onClick={() => toggle(index)}
                  >
                    {board[index] === 'x' && cross}
                    {board[index] === 'o' && circle}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <button className="reset" onClick={resetGame}>
        Reset
      </button>
      {aiThinking && (
        <p className="thinking">AI is thinking...</p>
      )}
    </div>
  );
};

export default TicTacToe;