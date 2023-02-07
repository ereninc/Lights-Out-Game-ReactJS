import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    isTest: false,
    chanceLightStartsOn: 0.25,
    testBoard: [
      [false, true, true, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ],
  };

  constructor(props) {
    super(props);

    //TODO: set initial state
    this.state = {
      hasWon: false,
      board: this.createBoard(),
    };
    this.resetGame = this.resetGame.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];

    if (this.props.isTest) {
      return this.props.testBoard;
    }
    // TODO: create array-of-arrays of true/false values
    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // TODO: flip this cell and the cells around it
    // flip self
    flipCell(y, x);
    // flip top
    flipCell(y - 1, x);
    // flip bottom
    flipCell(y + 1, x);
    // flip left
    flipCell(y, x - 1);
    // flip right
    flipCell(y, x + 1);

    // win when every cell is turned off
    // TODO: determine is the game has been won
    let hasWon = board.every((row) => row.every((cell) => !cell));

    this.setState({ board, hasWon });
  }

  resetGame() {
    this.setState({
      hasWon: false,
      board: this.createBoard(),
    });
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    if (this.state.hasWon) {
      return (
        <div className="container">
          <h2 className="neon-green">You Won!</h2>
          <button className="neon-orange btn__retry" onClick={this.resetGame}>
            PLAY AGAIN?
          </button>
        </div>
      );
    }
    // make table board
    let tblBoard = [];
    for (let i = 0; i < this.props.nrows; i++) {
      let row = [];
      for (let j = 0; j < this.props.ncols; j++) {
        let coord = `${i}-${j}`;
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[i][j]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }
      tblBoard.push(<tr key={i}>{row}</tr>);
    }

    return (
      <>
        <div className="container">
          <h1 className="neon-orange" style={{ display: "inline" }}>
            Lights
          </h1>
          <h1 className="neon-blue" style={{ display: "inline" }}>
            Out
          </h1>
          <table className="Board">
            <tbody>{tblBoard}</tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Board;
