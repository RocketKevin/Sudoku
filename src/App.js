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
    if (this.props.displayValue === 0) {
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
        onChange={event => this.setState({ inputValue: event.target.value.replace(/\D/, '') })}
      >
      </input>
    );
  }
}


class Board extends React.Component {

  //Create a square
  renderSquare(num) {
    return <Square
      displayValue={num}
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
    for (let i = 0; i < 9; i++) {
      if (parseInt(valueBoard[y * 9 + i]) === randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Check for conflict in col
  isPossibleCol(randomNumber, x, valueBoard) {
    for (let i = 0; i < 9; i++) {
      if (parseInt(valueBoard[i * 9 + x]) === randomNumber) {
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

  //Return position of which square currently in, either moving back, forward, or stay. 
  //Change the possibleNumberBoard and valueBoard
  positionGenerator(i, possibleNumberBoard, valueBoard) {

    if (possibleNumberBoard[i].length === 0) {

      //If there are no possble numbers left, refill
      possibleNumberBoard[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      valueBoard[i] = 0;
      valueBoard[i - 1] = 0;

      //Move backward by 1
      return -1;
    } else {

      //Get a random number from array
      let randomNumberOfArray = possibleNumberBoard[i][Math.floor(Math.random() * possibleNumberBoard[i].length)];

      //Checks for confliction for row, col, and block
      if (
        this.isPossibleRow(randomNumberOfArray, this.returnRow(i), valueBoard) &&
        this.isPossibleCol(randomNumberOfArray, this.returnCol(i), valueBoard) &&
        this.isPossibleBlock(randomNumberOfArray, this.returnBlock(i), valueBoard)
      ) {

        //If no confliction use the random number
        valueBoard[i] = [randomNumberOfArray];
        let index = possibleNumberBoard[i].indexOf(randomNumberOfArray);
        if (index >= 0) {
          possibleNumberBoard[i].splice(index, 1);
        }

        //Move forward by 1
        return 1;
      } else {

        //If conflicts, remove that possible number
        let indexOne = possibleNumberBoard[i].indexOf(randomNumberOfArray);
        if (indexOne >= 0) {
          possibleNumberBoard[i].splice(indexOne, 1);
        }

        valueBoard[i] = 0;

        //If it conflicts, stay
        return 0;
      }
    }
  }

  /**
   * This method checks the solutions for the specified row.
   * A row is valid if there's 9 values and all numbers 1-9 are present.
   *
   * @returns boolean, true if valid row, false otherwise
   * @param {*} rowToVerify, an integer number
   * @param {*} board, board is a 1D array representing Sudoku board
   */
  static isRowComplete(rowToVerify, board) {
    let numCol = 9;
    let maxSudokuValue = 9;
    const rowSet = new Set(); //create new set to store values of row
    
    //add values of board into Set
    for (let col = 0; col < numCol; col++) {
      //board is a 1D array, so we need to get the element num
      rowSet.add(board[(9 * rowToVerify) + col]); 
    }
    //should have 9 values in row
    if (rowSet.size !== maxSudokuValue) {
      return false;
    }

    // check if all possible values 1-9 are all in rowSet
    for (let possibleSudoKuValue = 1; possibleSudoKuValue <= maxSudokuValue; possibleSudoKuValue++) {
      if (rowSet.has(possibleSudoKuValue) === false) {
        return false;
      }
    }
    return true; //we've check that all numbers 1-9 are in the row
  }

  /**
   * This method validates the solutions for the specified col.
   * A collumn is valid if there's 9 values and all numbers 1-9 are present.
   *
   * @returns boolean, true if valid col, false otherwise
   * @param {*} colToVerify, an integer number
   * @param {*} board 
   */
  static isColComplete(colToVerify, board) {
    let numRow = 9;
    let maxSudokuValue = 9;
    const colSet = new Set(); //create new set to store values of col

    //add col values of board into Set
    for (let row = 0; row < numRow; row++) {
      colSet.add(board[(9 * row) + colToVerify]);
    }

    //should have 9 values in col
    if (colSet.size != maxSudokuValue) {
      return false;
    }

    // check if all possible values 1-9 are all in colSet
    for (let possibleSudoKuValue = 1; possibleSudoKuValue <= maxSudokuValue; possibleSudoKuValue++) {
      if (colSet.has(possibleSudoKuValue) === false) {
        return false;
      }
    }
    return true; //we've check that all numbers 1-9 are in the col
  }

  /**
   * This method checks the solutions for the specified subgrid.
   * A subgrid is valid if there's 9 values and all numbers 1-9 are present.
   * Subgrids are numbered as follows
   *
   * 0 1 2
   * 3 4 5
   * 6 7 8
   *
   * @returns boolean, true if valid subgrid, false otherwise.
   * @param {*} subgridToVerify integer number
   * @param {*} board 1D array representing Sudoku board
   */
  static isSubgridComplete (subgridToVerify, board) {
    const subgridSet = new Set(); //set to store values in the suggrid
    let rowStartingPoint = Math.floor(subgridToVerify / 3); //using integer division
    let colStartingPoint = (subgridToVerify % 3) * 3;

    //iterate through all values of the subgrid and add them to the set
    for (let row = rowStartingPoint; row < 3 + rowStartingPoint; row++) {
      for (let col = colStartingPoint; col < 3 + colStartingPoint; col++) {
        subgridSet.add(board[(9 * row) + col]);
      }
    }

    //check that there's 9 values in the subgrid
    let maxSudokuValue = 9;
    if (subgridSet.size != maxSudokuValue) {
      return false;
    }

    // check if all possible values 1-9 are all in subgridSet
    for (let possibleSudoKuValue = 1; possibleSudoKuValue <= maxSudokuValue; possibleSudoKuValue++) {
      if (subgridSet.has(possibleSudoKuValue) === false ) {
        return false;
      }
    }
    return true; //we've check that all numbers 1-9 are in the subgridSet
  }

  /**
   * This method checks if the board in the parameter is a valid solution
   * by checking whether all rows, collumn, and subgrid are valid. A component
   * is valid if it follows all Sudoku mechanics
   *
   * @returns boolean, false if the board violates any Sudoku mechanics,
   * true otherwise
   * @param {*} board, 1D array representing Sudoku board
   */
  static isSolutionComplete(board) {
    for (let index = 0; index < 9; index++) {
      //verifying each smaller section of the board
      if (Board.verifyRow(index, board) === false || Board.verifyCol(index, board) === false
        || Board.verifySubgrid(index, board) === false) {
        return false;
      }
    }
    return true;
  }

  

  render() {

    //For display
    let board = [];

    //Holds possible values of a square
    let possibleNumberBoard = [];

    //Holds one true value
    let valueBoard = [];

    let index = 0;

    while (index < 81) {

      possibleNumberBoard.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      valueBoard.push(0);

      //Get new postion of index
      let position = this.positionGenerator(index, possibleNumberBoard, valueBoard);
      let precheck = index + position;

      if (precheck >= 0) {

        //Where index is at
        index += position;
      } else {
        break;
      }

    }

    //Store all into board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
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
