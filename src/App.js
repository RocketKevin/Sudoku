import React from 'react';
import './App.css';

//Holds one true value
let valueBoard = [];
let mode = "easy";

/*
* This method checks the solutions for the specified row. 
* Returns true if valid row, false otherwise
*
* @param rowToVerify is an integer number, board is a 2D array representing Sudoku board
*/
function verifyRow(rowToVerify, rowSet) {
  var numCol = 9;
  var maxSudokuValue = 9;
  // console.log("True");
  //add values of board into Set
  for (var col = 0; col < numCol; col++) {
    rowSet.add(parseInt(valueBoard[rowToVerify * 9 + col]));
  }

  //should have 9 values in row
  if (rowSet.size !== maxSudokuValue) {
    return false;
  }

  // check if all possible values 1-9 are all in rowSet
  for (var possibleSudoKuValue = 1; possibleSudoKuValue <= maxSudokuValue; possibleSudoKuValue++) {
    if (rowSet.has(possibleSudoKuValue) === false) {
      return false;
    }
  }
  return true; //we've check that all numbers 1-9 are in the row
}

/*
* This method checks the solutions for the specified col. 
* Returns true if valid col, false otherwise
*
* @param rowToVerify is an integer number, board is a 2D array representing Sudoku board
*/
function verifyCol(colToVerify, colSet) {
  var numRow = 9;
  var maxSudokuValue = 9;
  // console.log("True");
  //add values of board into Set
  for (var row = 0; row < numRow; row++) {
    colSet.add(parseInt(valueBoard[row * 9 + colToVerify]));
  }

  //should have 9 values in row
  if (colSet.size !== maxSudokuValue) {
    return false;
  }

  // check if all possible values 1-9 are all in colSet
  for (var possibleSudoKuValue = 1; possibleSudoKuValue <= maxSudokuValue; possibleSudoKuValue++) {
    if (colSet.has(possibleSudoKuValue) === false) {
      return false;
    }
  }
  return true; //we've check that all numbers 1-9 are in the col
}

/*
* This method checks the solutions for the specified subgrid. 
* Returns true if valid subgrid, false otherwise. Subgrids are numbered
* 
* 0 1 2
* 3 4 5
* 6 7 8
*
* @param subgridToVerify is an integer number, board is a 2D array representing Sudoku board
*/
function verifySubgrid(subgridToVerify, colSet) {
  let subgridSet = new Set();
  var colStartingPoint = (subgridToVerify % 3) * 3;
  var rowStartingPoint = Math.floor(subgridToVerify / 3); //using integer division
  //subgrid for first row

  for (var row = (rowStartingPoint*3); row < 3 + (rowStartingPoint*3); row++) {
    for (var col = colStartingPoint; col < 3 + colStartingPoint; col++) {
      subgridSet.add(parseInt(valueBoard[row * 9 + col]));
    }
  }

  var maxSudokuValue = 9;
  if (colSet.size !== maxSudokuValue) {
    return false;
  }

  // check if all possible values 1-9 are all in colSet
  for (var possibleSudoKuValue = 1; possibleSudoKuValue <= maxSudokuValue; possibleSudoKuValue++) {
    if (colSet.has(possibleSudoKuValue) === false) {
      return false;
    }
  }
  return true; //we've check that all numbers 1-9 are in the col
  
}

/*
* This method checks if the board in the parameter is a valid solution
* by checking whether each row, collumn, and subgrid are valid.
* Method returns false if the board violates any Sudoku mechanics, 
* true otherwise. 
*/
function verifySolution() {
  
  let colSet = new Set(); //create new set to store values of col
  let rowSet = new Set(); //create new set to store values of row

  for (var index = 0; index < 9; index++) {
    let verifyColBox = verifyCol(index, colSet, rowSet);
    let verifyRowBox = verifyRow(index, rowSet);    
    let verifySubgridBox = verifySubgrid(index, colSet);

    colSet.clear();
    rowSet.clear();
    if (verifyRowBox === false || verifyColBox === false || verifySubgridBox === false) {
      return false;
    }
  }

  return true;
}

function stateOfWorld() {
  if(document.readyState === "complete") {
    for(let i = 0; i < 81; i++) {
      valueBoard[i] = document.getElementById(i).value;
    }
    console.log("True");
  }

  if(verifySolution() === true) {
    return true;
  }
  return false;
}

function easy() {
  var mode = "easy";
  localStorage.setItem("mode", mode);
  window.location.reload();
}

function medium() {
  var mode = "medium";
  localStorage.setItem("mode", mode);
  window.location.reload();
}

function hard() {
  var mode = "hard";
  localStorage.setItem("mode", mode);
  window.location.reload();
}

function newGame() {
  var nowMode = mode;
  localStorage.setItem("mode", nowMode);
  window.location.reload();
}

function generate() {
  if(document.readyState === "complete") {
    let selectMenu = document.getElementById("selectMenu");
    let modeVal = selectMenu.options[selectMenu.selectedIndex].text;
    if(modeVal === "Easy") {
      easy();
    } else if(modeVal === "Medium") {
      medium();
    } else if(modeVal === "Hard") {
      hard();
    }
  }
}

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
    let whichClass = "square";

    if(Math.floor(this.props.celliD / 9) % 3 === 0) {
      whichClass += " top";
    } 
    if(Math.floor(this.props.celliD / 9) % 3 === 2) {
      whichClass += " bottom";
    } 
    if(this.props.celliD % 3 === 0) {
      whichClass += " left";
    } 
    if(this.props.celliD % 3 === 2) {
      whichClass += " right";
    }

    //If there is no value, player can enter value
    if (this.props.displayValue === 0) {
      val = this.state.inputValue;
      whichClass += " zero";
    }

    return (

      //Each square is an input box 
      <input
        type=""
        class={whichClass}
        id={this.props.celliD}

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
  renderSquare(iD, num) {
    return <Square
      celliD = {iD} 
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
  isPossibleRow(randomNumber, y, board) {
    for (let i = 0; i < 9; i++) {
      if (parseInt(board[y * 9 + i]) === randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Check for conflict in col
  isPossibleCol(randomNumber, x, board) {
    for (let i = 0; i < 9; i++) {
      if (parseInt(board[i * 9 + x]) === randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Checks 3 by 3 block
  isPossibleBlock(randomNumber, position, board) {

    //Iterate through the 3 by 3 block
    for (let i = 0; i < 9; i++) {
      let oneOfTheNumberInThreeByThreeBlock = Math.floor(position / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (position % 3);

      //If one of the number in 3 by 3 block is the same as the random number
      if (parseInt(board[oneOfTheNumberInThreeByThreeBlock]) === randomNumber) {
        return false;
      }
    }
    return true;
  }

  //Remove a random number from the board
  removeRandomNumber(board) {

    //Pick a random position o the board
    let randomPositionOfBoard = Math.floor(Math.random() * board.length);

    let positionAndValue = [];

    //Change the random number if the position it's on was a zero
    while(parseInt(board[randomPositionOfBoard]) === 0) {
      //Reset random number
      randomPositionOfBoard = Math.floor(Math.random() * board.length);
    }
  
    //Back up position of board's value removed and it's number
    positionAndValue.push(randomPositionOfBoard);
    positionAndValue.push(board[randomPositionOfBoard]);
  
    //Set value of the random picked position to zero
    board[randomPositionOfBoard] = 0;
      
    //Tell which position got their number removed and what number
    return positionAndValue;
  }

  getPossibleNumberInEmptySquares(board, backup) {
    let positionAndAllPossibleNumbers = [];
    let oneSetOfPossibleNumbers = [];
    for(let i = 0; i < backup.length; i++) {
      for(let j = 1; j < 10; j++) {

        if( this.isPossibleRow(j, this.returnRow(backup[i]), board) &&
            this.isPossibleCol(j, this.returnCol(backup[i]), board) &&
            this.isPossibleBlock(j, this.returnBlock(backup[i]), board)
        ) {
          oneSetOfPossibleNumbers.push(j);
        }
      }

      positionAndAllPossibleNumbers.push([backup[i], oneSetOfPossibleNumbers]);

      oneSetOfPossibleNumbers = [];
    }
    return positionAndAllPossibleNumbers;
  }

  getPossibleNumberInThisSquares(board, index) {
    let allPossibleNumbers = [];
    for(let j = 1; j < 10; j++) {
      if( this.isPossibleRow(j, this.returnRow(index), board) &&
          this.isPossibleCol(j, this.returnCol(index), board) &&
          this.isPossibleBlock(j, this.returnBlock(index), board)
      ) {
        allPossibleNumbers.push(j);
      }
    }
    return allPossibleNumbers;
  }

  //Temperary
  cheapSolver(valueBoard) {
    let tempBoard = [];
    let possibleNumbers = [];
    let onOrOff = 1;
    while(onOrOff === 1) {
      onOrOff = 0;
      for(let i = 0; i < 81; i++) {
        tempBoard[i] = valueBoard[i];
        if(tempBoard[i] === 0) {
          possibleNumbers = this.getPossibleNumberInThisSquares(valueBoard, i);
          if(possibleNumbers.length === 1) {
            tempBoard[i] = parseInt(possibleNumbers);
          } else if(possibleNumbers.length === 0) {
            return false;
          } else {
            return false;
          }
        }
      }

      let a = 0
      while(a < 81) {
        if(tempBoard[a] === 0) {
          onOrOff = 1;
        }
        a++;
      }
    }
    return true;
  }

  isUnique(board, possibleNumber) {
    //console.log(possibleNumber[2]);
    for(let i = 0; i < possibleNumber.length; i++) {
        if(possibleNumber[i][1].length > 1) {
            //console.log("true");
            for(let j = 0; j < possibleNumber[i][1].length; j++) {
              //console.log(possibleNumber[i][1][j]);
              board[possibleNumber[i][0]] = possibleNumber[i][1][j];
              
              
              if(this.cheapSolver(board)) {
                board[possibleNumber[i][0]] = 0;
                return false;
              }
              
              board[possibleNumber[i][0]] = 0;
            }

            //If more than one, plug in the number
            //Solve the board
            //If solvable return false
            //Remove number
        }
    }
    return true;
  }

  safelyRemoveNumbers(board) {
    let backup = [];
    let possibleNumbers = [];
    let index = 0;
    let amountRemove = 46;
    if(mode === "easy") {
      amountRemove = 15;
    } else if(mode === "medium") {
      amountRemove = 30;
    }
    while(index < amountRemove) {
      //Remove number and obtain it's value and position
      backup = this.removeRandomNumber(board);
      //Find all possible answers for each cell
      possibleNumbers = this.getPossibleNumberInEmptySquares(board, backup);
      //Check unique 

      if(this.isUnique(board, possibleNumbers)) {
        index++;
      } else {
        board[backup[0]] = backup[1];
      }
      //console.log(backup);
    }

    return 0;
  }

  //Return position of which square currently in, either moving back, forward, or stay. 
  //Change the possibleNumberBoard and valueBoard
  positionGenerator(i, possibleNumberBoard, board) {

    if (possibleNumberBoard[i].length === 0) {

      //If there are no possble numbers left, refill
      possibleNumberBoard[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      board[i] = 0;
      board[i - 1] = 0;

      //Move backward by 1
      return -1;
    } else {

      //Get a random number from array
      let randomNumberOfArray = possibleNumberBoard[i][Math.floor(Math.random() * possibleNumberBoard[i].length)];

      //Checks for confliction for row, col, and block
      if(
        this.isPossibleRow(randomNumberOfArray, this.returnRow(i), board) &&
        this.isPossibleCol(randomNumberOfArray, this.returnCol(i), board) &&
        this.isPossibleBlock(randomNumberOfArray, this.returnBlock(i), board)
      ) {

        //If no confliction use the random number
        board[i] = [randomNumberOfArray];
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

        board[i] = 0;

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

    for(let i = 0; i < 81; i++) {
      possibleNumberBoard.push([1,2,3,4,5,6,7,8,9]);
      valueBoard.push(0);
    }

    let index = 0;

    while(index < 81) {

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

    this.safelyRemoveNumbers(valueBoard);

    //Store all into board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
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

class Box extends React.Component {
  render() {

    let text = "Something isn't right. Keep going!";
    let box = null;
    if(this.props.openSubmit) { 
      if(stateOfWorld()) {
        text = "You Win";
      }
  
      box = (
        <div id="dialog">
          <div>
            {text}
          </div>
          <button id="close" onClick = {this.props.closeSubmit}>
            Close
          </button>
        </div>
      );
    } else if(this.props.openNewGame) {
      box = (
        <div id="dialog">
          <div class="custom-select">
            <select id="selectMenu">
              <option value="0">Select Mode:</option>
              <option value="1">Easy</option>
              <option value="2">Medium</option>
              <option value="3">Hard</option>
            </select>
          </div>
          <button id="close" onClick = {generate}>
            Generate
          </button>
          <button id="close" onClick = {this.props.closeNewGame}>
            Close
          </button>
        </div>
      );
    }

    return(
      <div>
        {box}
      </div>
    );
  }
}

class Button extends React.Component {

  state = {
    openSubmit: false,
    openNewGame: false
  }

  render() {
    return(
      <div>
        <button className="button" onClick={(e) => this.setState({openSubmit: true})}>
          Submit
        </button>
        <button className="button" onClick={(e) => this.setState({openNewGame: true})}>
          New Mode
        </button>
        <button className="button" onClick={newGame}>
          New Board (Same Mode)
        </button>
        <Box 
          openSubmit = {this.state.openSubmit} 
          closeSubmit = {(e) => this.setState({openSubmit: false})}
          openNewGame = {this.state.openNewGame} 
          closeNewGame = {(e) => this.setState({openNewGame: false})}
        />
      </div>
    )
  }
}

class App extends React.Component {
  
  render() {

    let newMode = localStorage.getItem("mode");

    if(newMode !== mode) {
      mode = newMode;
    }

    return (
      <div className="App">

        <h1 id="title">
          Sudoku!
        </h1>

        <div className="game-board">
          <Board />
        </div>

        <div>
          <Button />
        </div>

      </div>
    );
  }
}

export default App;
