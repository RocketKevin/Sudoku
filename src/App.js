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
    
    let val = this.props.displayValue;
    //let val = num;

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

  renderSquare(iD, num) {
    return <Square 
      inputValue = {[1,2,3,4,5,6,7,8,9]}
      displayValue = {num}
    />;
  }
  /*
  returnBlock(cell) {
    return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
  }
  */
  isPossibleRow(randomNumber, y, valueBoard, possibleNumberBoard) {
    for(let i = 0; i < 9; i++) {
      if(valueBoard[y * 9 + i] == randomNumber) {

        //If conflicts, remove that possible number
        possibleNumberBoard[(y * 9 + i)].splice(randomNumber - 1,1);
        return false;
      }
    }
    return true;
  }

  isPossibleCol(randomNumber, x, valueBoard, possibleNumberBoard) {
    for (let i = 0; i < 9; i++) {
      if(valueBoard[i * 9 + x] === randomNumber) {
        
        //If conflicts, remove that possible number
        possibleNumberBoard[(i * 9 + x)].splice(randomNumber - 1,1);
        return false;
      }
    }
    return true;
  }

  /*
  isPossibleBlock(randomNumber, block,sudoku) {
    for (var i=0; i<=8; i++) {
      if (sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)] == number) {
        return false;
      }
    }
    return true;
  }
  */
  //Return Position,  and change the reduce possible number
  number(x, y, possibleNumberBoard, valueBoard) {
    //console.log("x: " + x + ", y: " + y);
    //console.log("possibleNumberBoard: " + possibleNumberBoard[y * 9 + x] + ", valueBoard: " + valueBoard[y * 9 + x]);

    if((y * 9 + x) === 0) {

      //Fill in the (0,0) of the board
      valueBoard[(y * 9 + x)] = possibleNumberBoard[(y * 9 + x)][Math.floor(Math.random() * possibleNumberBoard[(y * 9 + x)].length)];
      //console.log("1st: " + possibleNumberBoard[(y * 9 + x)][Math.floor(Math.random() * possibleNumberBoard[(y * 9 + x)].length)]);

      //Move forward by 1
      return 0;
    } else if(possibleNumberBoard[y * 9 + x].length === 0) {

      //If there are no possble numbers left, refill
      possibleNumberBoard[y * 9 + x] = [1,2,3,4,5,6,7,8,9];
      //console.log("True");

      //Move backward by 1
      return -2;
    } else {

      //console.log("True");

      //Get a random number from array
      let randomNumberOfArray = possibleNumberBoard[(y * 9 + x)][Math.floor(Math.random() * possibleNumberBoard[(y * 9 + x)].length)];
      
      //Checks for confliction for row and col
      let noConflictRow = this.isPossibleRow(randomNumberOfArray, y, valueBoard, possibleNumberBoard);
      let noConflictCol = this.isPossibleCol(randomNumberOfArray, x, valueBoard, possibleNumberBoard);
      
      if(noConflictRow && noConflictCol) {

        //If no confliction use the random number
        valueBoard[(y * 9 + x)] = [randomNumberOfArray];

        //Move forward by 1
        return 0;
      } else {

        //If it conflicts, move backward by 1
        return -1;
      }
    }
  }

  render() {

    let board = [];  
    let possibleNumberBoard = [];
    let valueBoard = [];

    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        possibleNumberBoard.push([1,2,3,4,5,6,7,8,9]);
        valueBoard.push(0);
      }
    }

    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        //console.log(j);
        let position = this.number(j, i, possibleNumberBoard, valueBoard);
        //console.log("position: " + position);
        j += position;
      }
    }
    /*
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        console.log((i * 9 +j) + ": " + valueBoard[(i * 9 + j)]);
      }
    }
    */
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        board.push(
          <div>
            {this.renderSquare((i * 9 + j), valueBoard[i * 9 + j])}
          </div>
        )
      }
    }
    
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
