import React from 'react';
import './App.css';

//Making individual squares
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }
  render() {
    
    //Get variables from outside
    let val = this.props.displayValue;

    //If there is no value, player can enter value
    if(this.props.displayValue === 0) {
      val = this.state.inputValue;
    }

    return (

      //Each square is an input box 
      <input 
        type="" 
        className="square"

        //Only one letter, number, or character
        maxlength="1"

        //Where value is kept
        value={
          val
        }

        //Only number can be type
        onChange={event => this.setState({inputValue: event.target.value.replace(/\D/,'')})}
      >
      </input>
    );
  }
}

class Board extends React.Component {

  //Create a square
  renderSquare(num) {
    return <Square 
      displayValue = {num}
    />;
  }

  // given a sudoku cell, returns the row
  returnRow(boardSize) {
	  return Math.floor(boardSize / 9);
  }

  // given a sudoku cell, returns the column
  returnCol(boardSize) {
	  return boardSize % 9;
  }

  //Gives 3 by 3 block
  returnBlock(boardSize) {
    return Math.floor(this.returnRow(boardSize) / 3) * 3 + Math.floor(this.returnCol(boardSize) / 3);
  }

  //Check for conflict in row
  isPossibleRow(randomNumber, y, valueBoard) {
    for(let i = 0; i < 9; i++) {
      //Change === to == to work
      //console.log("valueBoard: " + valueBoard[y * 9 + i] + ", randomNumber: " + randomNumber);
      if(valueBoard[y * 9 + i] == randomNumber) {
        console.log("True");
        return false;
      }
    }
    return true;
  }
  
  //Check for conflict in col
  isPossibleCol(randomNumber, x, valueBoard) {
    for (let i = 0; i < 9; i++) {
      //Change === to == to work
      //console.log("valueBoard: " + valueBoard[i * 9 + x] + ", randomNumber: " + randomNumber); 
      if(valueBoard[i * 9 + x] == randomNumber) {
        console.log("True");
        return false;
      }
    }
    return true;
  }

  //Checks 3 by 3 block
  isPossibleBlock(randomNumber, boardSize, valueBoard) {
    for (let i = 0; i < 9; i++) {
      if (valueBoard[Math.floor(boardSize / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (boardSize % 3)] == randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Return position of which square currently in, either moving back, forward, or stay. 
  //Change the possibleNumberBoard and valueBoard
  positionGenerator(x, y, i, possibleNumberBoard, valueBoard) {

    //console.log("x: " + x + ", y: " + y);
    //console.log("possibleNumberBoard: " + possibleNumberBoard[y * 9 + x] + ", valueBoard: " + valueBoard[y * 9 + x]);

    let position = y * 9 + x;

    console.log("possibleNumberBoard: " + possibleNumberBoard[position]);

    if(possibleNumberBoard[position].length === 0) {

      //If there are no possble numbers left, refill
      possibleNumberBoard[position] = [1,2,3,4,5,6,7,8,9];

      valueBoard[position] = 0;
      valueBoard[position - 1] = 0;
      console.log("Move Back");

      //Move backward by 1
      return -2;
    } else {

      //console.log("True");

      //Get a random number from array
      let randomNumberOfArray = possibleNumberBoard[position][Math.floor(Math.random() * possibleNumberBoard[position].length)];
      
      //Checks for confliction for row and col
      let noConflictRow = this.isPossibleRow(randomNumberOfArray, y, valueBoard);
      let noConflictCol = this.isPossibleCol(randomNumberOfArray, x, valueBoard);
      let noConflictBlock = this.isPossibleBlock(randomNumberOfArray, this.returnBlock(i), valueBoard);

      if(noConflictRow && noConflictCol && noConflictBlock) {

        //console.log((y * 9 + x) + ": " + randomNumberOfArray);
        //If no confliction use the random number
        valueBoard[position] = [randomNumberOfArray];
        let index = possibleNumberBoard[position].indexOf(randomNumberOfArray);
        if(index >= 0) {
          possibleNumberBoard[position].splice(index, 1);
        }

        console.log("Move Forward");
        //Move forward by 1
        return 0;
      } else {

        //If conflicts, remove that possible number
        let indexOne = possibleNumberBoard[position].indexOf(randomNumberOfArray);
        if(indexOne >= 0) {
          possibleNumberBoard[position].splice(indexOne,1);
        }

        valueBoard[position] = 0;

        console.log("Stay");
        //If it conflicts, stay
        return -1;
      }
    }
  }

  render() {

    //For display
    let board = [];  

    //Holds possible values of a square
    let possibleNumberBoard = [];

    //Holds one true value
    let valueBoard = [];

    //Give value to boards
    for(let i = 0; i < 81; i++) {
      possibleNumberBoard.push([1,2,3,4,5,6,7,8,9]);
      valueBoard.push(0);
    }

    let x = 0;
    let y = 0;

    for(let i = 0; i < 81; i++) {
      x = i % 9;
      y = Math.floor(i/9);

      //Get new postion of x
      let position = this.positionGenerator(x, y, i, possibleNumberBoard, valueBoard);
      let precheck = i + position;

      if(precheck >= 0) {
        //Where x is at
        i += position;
        console.log("i: " + i);
      } else {
        break;
      }
    }

    //Display the true value board
    /*
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        console.log((i * 9 +j) + ": " + valueBoard[(i * 9 + j)]);
      }
    }
    */

    //Store all into board
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        board.push(
          <div>
            {this.renderSquare(valueBoard[i * 9 + j])}
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
