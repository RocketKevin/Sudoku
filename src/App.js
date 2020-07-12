import React from 'react';
import './App.css';

/*
function input() {
  let num = 0;

}
*/
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }
  render() {

    //let num = Math.floor(Math.random() * 9) + 1;
    
    return (
      <input 
        type="" 
        className="square"
        maxlength="1"
        value={this.state.inputValue}
        onChange={event => this.setState({inputValue: event.target.value.replace(/\D/,'')})}
      >
      </input>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {

    let oneByThree = [];
    let threeByThree = [];
    let threeByNine = [];
    let nineByNine = [];

    //1x3 board
    for(let i = 0; i < 3; i++){
      oneByThree.push(
        <div>
          {this.renderSquare(i)}
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

    return (
      <div className="gameBoard">
        {nineByNine}
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
