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

  // given a sudoku position, returns the row
  returnRow(position) {
	  return Math.floor(position / 9);
  }

  // given a sudoku position, returns the column
  returnCol(position) {
	  return position % 9;
  }

  //Gives 3 by 3 block
  returnBlock(position) {
    return Math.floor(this.returnRow(position) / 3) * 3 + Math.floor(this.returnCol(position) / 3);
  }

  //Check for conflict in row
  isPossibleRow(randomNumber, y, valueBoard) {
    for(let i = 0; i < 9; i++) {
      if(parseInt(valueBoard[y * 9 + i]) === randomNumber) {
        return false;
      }
    }
    return true;
  }
  
  //Check for conflict in col
  isPossibleCol(randomNumber, x, valueBoard) {
    for (let i = 0; i < 9; i++) {
      if(parseInt(valueBoard[i * 9 + x]) === randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Checks 3 by 3 block
  isPossibleBlock(randomNumber, position, valueBoard) {

    //Iterate through the 3 by 3 block
    for (let i = 0; i < 9; i++) {
      let oneOfTheNumberInThreeByThreeBlock = Math.floor(position / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (position % 3);
      
      //If one of the number in 3 by 3 block is the same as the random number
      if (parseInt(valueBoard[oneOfTheNumberInThreeByThreeBlock]) === randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Remove a random number from the board
  removeRandomNumber(valueBoard) {

    //Pick a random position o the board
    let randomPositionOfBoard = Math.floor(Math.random() * valueBoard.length);

    let positionAndValue = [];

    //Change the random number if the position it's on was a zero
    while(parseInt(valueBoard[randomPositionOfBoard]) === 0) {
      //Reset random number
      randomPositionOfBoard = Math.floor(Math.random() * valueBoard.length);
    }

    //Back up position of board's value removed and it's number
    positionAndValue.push(randomPositionOfBoard);
    positionAndValue.push(valueBoard[randomPositionOfBoard]);

    //Set value of the random picked position to zero
    valueBoard[randomPositionOfBoard] = 0;
    
    //Tell which position got their number removed and what number
    return positionAndValue;
  }

  //Set the value of a position given by backup
  resetValueBackToOriginal(undo, valueBoard) {
    //Reset the position, given from removeRandomNumber method, of the board's value
    valueBoard[undo[0]] = undo[1];
  }

  getPossibleNumberInEmptySquares(valueBoard, backup) {
    let positionAndAllPossibleNumbers = [];
    let oneSetOfPossibleNumbers = [];
    for(let i = 0; i < backup.length; i++) {
      for(let j = 1; j < 10; j++) {
        if( this.isPossibleRow(j, this.returnRow(backup[i][0]), valueBoard) &&
            this.isPossibleCol(j, this.returnCol(backup[i][0]), valueBoard) &&
            this.isPossibleBlock(j, this.returnBlock(backup[i][0]), valueBoard)
        ) {
          oneSetOfPossibleNumbers.push(j);
        }
      }
      positionAndAllPossibleNumbers.push([backup[i][0], oneSetOfPossibleNumbers]);
      oneSetOfPossibleNumbers = [];
    }
    return positionAndAllPossibleNumbers;
  }

  /* In Progress */
  isUnique(valueBoard, possibleNumber, backup) {
    //console.log(possibleNumber);
    for(let i = 0; i < possibleNumber.length; i++) {
        if(possibleNumber[i][1].length < 1) {
            console.log("true");
            //If more than one, plug in the number
            //Solve the board
            //If solvable return false
            //Remove number
        }
    }
    return true;
  }

  safelyRemoveNumbers(valueBoard) {
    let backup = [];
    let possibleNumbers = [];
    let index = 0;
    while(index < 15) {
      //Remove number and obtain it's value and position
      backup.push(this.removeRandomNumber(valueBoard));
      console.log(backup);
      //Find all possible answers for each cell
      possibleNumbers = this.getPossibleNumberInEmptySquares(valueBoard, backup);
      //Check unique 
      if(this.isUnique(valueBoard, possibleNumbers, backup)) {
        index++;
      } else {
        this.resetValueBackToOriginal(backup[index], valueBoard);
      }
      //console.log(backup);
    }

    return 0;
  }

  //Return position of which square currently in, either moving back, forward, or stay. 
  //Change the possibleNumberBoard and valueBoard
  positionGenerator(i, possibleNumberBoard, valueBoard) {
    
    if(possibleNumberBoard[i].length === 0) {

      //If there are no possble numbers left, refill
      possibleNumberBoard[i] = [1,2,3,4,5,6,7,8,9];

      valueBoard[i] = 0;
      valueBoard[i - 1] = 0;

      //Move backward by 1
      return -1;
    } else {

      //Get a random number from array
      let randomNumberOfArray = possibleNumberBoard[i][Math.floor(Math.random() * possibleNumberBoard[i].length)];
      
      //Checks for confliction for row, col, and block
      if(
        this.isPossibleRow(randomNumberOfArray, this.returnRow(i), valueBoard) && 
        this.isPossibleCol(randomNumberOfArray, this.returnCol(i), valueBoard) && 
        this.isPossibleBlock(randomNumberOfArray, this.returnBlock(i), valueBoard)
      ) {

        //If no confliction use the random number
        valueBoard[i] = [randomNumberOfArray];
        let index = possibleNumberBoard[i].indexOf(randomNumberOfArray);
        if(index >= 0) {
          possibleNumberBoard[i].splice(index, 1);
        }

        //Move forward by 1
        return 1;
      } else {

        //If conflicts, remove that possible number
        let indexOne = possibleNumberBoard[i].indexOf(randomNumberOfArray);
        if(indexOne >= 0) {
          possibleNumberBoard[i].splice(indexOne,1);
        }

        valueBoard[i] = 0;

        //If it conflicts, stay
        return 0;
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
    
    for(let i = 0; i < 81; i++) {
      possibleNumberBoard.push([1,2,3,4,5,6,7,8,9]);
      valueBoard.push(0);
    }

    let index = 0;

    while(index < 81) {

      //Get new postion of index
      let position = this.positionGenerator(index, possibleNumberBoard, valueBoard);
      let precheck = index + position;

      if(precheck >= 0) {

        //Where index is at
        index += position;
      } else {
        break;
      }

    }

    this.safelyRemoveNumbers(valueBoard);
    
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
