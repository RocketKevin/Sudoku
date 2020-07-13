import React from 'react';
import './App.css';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }
  render() {

    //let num = Math.floor(Math.random() * 9) + 1;
    
    let val = this.props.inputValue;

    if(this.props.inputValue === 0) {
      val = this.state.inputValue;
    }

    return (
      <input 
        type="" 
        className="square"
        maxlength="1"
        value={
          val
        }
        onChange={event => this.setState({inputValue: event.target.value.replace(/\D/,'')})}
      >
      </input>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square 
      inputValue = {0}
    />;
  }

  render() {
    /*
    let oneByThree = [];
    let threeByThree = [];
    let threeByNine = [];
    let nineByNine = [];
    */
    let board = [];

    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        board.push(
          <div>
            {this.renderSquare(i * 9 + j)}
          </div>
        )
      }
    }

    /*
    //1x3 board
    for(let i = 0; i < 3; i++){
      oneByThree.push(
        <div>
          {this.renderSquare()}
        </div>
      );
    }

    //3x3 board
    for(let i = 0; i < 3; i++){
      threeByThree.push(
        <div className="board-row">
          {oneByThree}
        </div>
      );
    }

    //3x9 board
    for(let i = 0; i < 3; i++){
      threeByNine.push(
        <div className="side">
          {threeByThree}
        </div>
      );
    }

    //9x9 board
    for(let i = 0; i < 3; i++){
      nineByNine.push(
        <div>
          {threeByNine}
        </div>
      );
    }
    */

    return (
      <div className="gameBoard">
        {board}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        
        <h1 id="title">
          Sudoku!
        </h1>

        <div className="game-board">
          <Board />
        </div>
        
        <button id="submit">
          Submit
        </button>

      </div>
    );
  }
}

export default App;
