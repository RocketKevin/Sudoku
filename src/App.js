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

  //ToDo: Gives 3 by 3 block
  /*
  returnBlock(cell) {
    return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
  }
  */

  //Check for conflict in row
  isPossibleRow(randomNumber, y, valueBoard, possibleNumberBoard) {
    for(let i = 0; i < 9; i++) {
      //Change === to == to work
      if(valueBoard[y * 9 + i] == randomNumber) {
        return false;
      }
    }
    return true;
  }
  
  //Check for conflict in col
  isPossibleCol(randomNumber, x, valueBoard) {
    for (let i = 0; i < 9; i++) {
      //Change === to == to work
      if(valueBoard[i * 9 + x] == randomNumber) {
        return false;
      }
    }
    return true;
  }

  //ToDo: Checks 3 by 3 block
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

  //Return position of which square currently in, either moving back, forward, or stay. 
  //Change the possibleNumberBoard and valueBoard
  positionGenerator(x, y, possibleNumberBoard, valueBoard) {

    //console.log("x: " + x + ", y: " + y);
    //console.log("possibleNumberBoard: " + possibleNumberBoard[y * 9 + x] + ", valueBoard: " + valueBoard[y * 9 + x]);

    if((y * 9 + x) === 0) {

      //Fill in the (0,0) of the board
      valueBoard[(y * 9 + x)] = possibleNumberBoard[(y * 9 + x)][Math.floor(Math.random() * possibleNumberBoard[(y * 9 + x)].length)];

      //console.log("1st: " + possibleNumberBoard[(y * 9 + x)][Math.floor(Math.random() * possibleNumberBoard[(y * 9 + x)].length)]);

      //Move forward by 1
      return 1;
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

        //console.log((y * 9 + x) + ": " + randomNumberOfArray);
        //If no confliction use the random number
        valueBoard[(y * 9 + x)] = [randomNumberOfArray];

        //Move forward by 1
        return 0;
      } else {

        //If conflicts, remove that possible number
        let indexOne = possibleNumberBoard[(y * 9 + x)].indexOf(randomNumberOfArray);
        if(indexOne >= 0) {
          possibleNumberBoard[(y * 9 + x)].splice(indexOne,1);
        }

        //If conflicts, remove that possible number
        let indexTwo = possibleNumberBoard[(y * 9 + x)].indexOf(randomNumberOfArray);
        if(indexTwo >= 0) {
          possibleNumberBoard[(y * 9 + x)].splice(indexTwo,1);
        }

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
      let position = this.positionGenerator(x, y, possibleNumberBoard, valueBoard);

      //Where x is at
      x += position;
      console.log("x: " + x);
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
