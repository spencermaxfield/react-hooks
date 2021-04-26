// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

import {useLocalStorageState} from "../utils";

function Board({onSelectSquare, onRestart, squares, status}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="status">{status}</div>
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
      <button className="restart" onClick={onRestart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = React.useState(0);

  const currentSquares = history[currentStep];

  // Update all the state every time a turn completes and squares is updated
  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    // If the square's already been selected or the game is over, do nothing
    if (currentSquares[square] || winner) {
        return;
    }

    // It's a legit move. Create a new squares state.
    const squaresCopy = [...currentSquares];
    squaresCopy[square] = nextValue;

    // Also increment the current step counter
    const updatedCurrentStep = currentStep + 1;
    setCurrentStep(updatedCurrentStep);

    // Ditch anything after the current step in the history because going back
    // to a previous state and then making a change invalidates all the states
    // after that one. Then add our new state.
    history.splice(updatedCurrentStep);
    history.push(squaresCopy);
    setHistory(history);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onSelectSquare={selectSquare} onRestart={restart} squares={currentSquares} status={status}/>
        <div className="game-info">
          <ol>
              {history.map((state, index) => {
                  const indexLabel = index === 0 ? 'game start' : `move #${index}`;
                  return <li key={index}><button disabled={currentStep === index} onClick={() => setCurrentStep(index)}>{`Go to ${indexLabel}`}</button></li>
              })}
          </ol>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
