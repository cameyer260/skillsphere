"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pawn, Rook, Knight, Bishop, Queen, King, Piece, PieceImage } from "./piece";

export type PlayerColor = "white" | "black";

export interface Position {
    r: number,
    c: number,
}

export class Board {
  boardMatrix: (Piece | null)[][];

  constructor(pc: PlayerColor, bM?: (Piece | null)[][]) {
    if (bM) {
      this.boardMatrix = bM;
      return;
    }

    let temp = [
      (pc === "white" ? ['r', 'k', 'b', 'q', 'K', 'b', 'k', 'r'] : ['r', 'k', 'b', 'K', 'q', 'b', 'k', 'r'] ),
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      (pc === "white" ? ['r', 'k', 'b', 'q', 'K', 'b', 'k', 'r'] : ['r', 'k', 'b', 'K', 'q', 'b', 'k', 'r'] ),
    ];

    this.boardMatrix = temp.map((arr, row) => {
      const color = (pc === "white" ? (row < 2 ? "black" : "white") : (row < 2 ? "white" : "black"));
      return arr.map((el, col) => {
        switch(el) {
          case 'p':
            return new Pawn(color);
          case 'r':
            return new Rook(color);
          case 'k':
            return new Knight(color);
          case 'b':
            return new Bishop(color);
          case 'q':
            return new Queen(color);
          case 'K':
            return new King(color);
          default:
            return null;
        }
      });
    });
  };
};

const handleMove = (
  position: Position, 
  board: Board, 
  playerColor: PlayerColor, 
  turn: PlayerColor, 
  clickedPiece: Position | null, 
  setClickedPiece: React.Dispatch<React.SetStateAction<Position | null>>, 
  setTurn: React.Dispatch<React.SetStateAction<PlayerColor>>, 
  setBoard: React.Dispatch<React.SetStateAction<Board>>,
  setMoveError: React.Dispatch<React.SetStateAction<Position | null>>
) => {
  /**
   * 1. call move on piece, will return true on success, false on fail
   * 2. if fail, highlight toPos red temporarily
   * 3. update all states (except board because that is handled in piece's move function): turn, clickedPiece
  **/
  if (!board || !clickedPiece) return;
  if (!board.boardMatrix[clickedPiece.r][clickedPiece.c]?.move(clickedPiece, position, board, setBoard)) {
    // move is called and if it fails we highlight toPos in this block
    setMoveError(position);
    setTimeout(() => {
      setMoveError(null);
    }, 1000);
    setClickedPiece(null);

    return; // exit function without updating turn because on failure to move turn does not change
  }

  // update states assuming success
  // setTurn(playerColor === "white" ? "black" : "white");          TEMP DISABLE FOR DEVELOPMENT
  setClickedPiece(null);
}

const handleClick = (
  position: Position, 
  board: Board, 
  playerColor: PlayerColor, 
  turn: PlayerColor, 
  clickedPiece: Position | null, 
  setClickedPiece: React.Dispatch<React.SetStateAction<Position | null>>, 
  setTurn: React.Dispatch<React.SetStateAction<PlayerColor>>, 
  setBoard: React.Dispatch<React.SetStateAction<Board>>, 
  setMoveError: React.Dispatch<React.SetStateAction<Position | null>>
) => {
  /**
   * 1. check if board is null, if it is exit this function
   * 2. check that it is our players turn, if it is not exit this function
   * 3. check if the square is not null and is our piece, if not exit this function
   * 4. check if clicked piece is null. if it is, set it, else, call handlemove function
  **/ 
  if (!board) return;
  if (playerColor !== turn) return;
  if (!clickedPiece && board.boardMatrix[position.r][position.c]?.color !== playerColor) return;
  if (!clickedPiece) {
    setClickedPiece(position);
    return;
  }
  handleMove(position, board, playerColor, turn, clickedPiece, setClickedPiece, setTurn, setBoard, setMoveError);
};

export default function gameBoard() {
  // current players turn
  const [ turn, setTurn ] = useState<PlayerColor>("white"); // white always starts first in chess

  // our players color
  const [ playerColor, setPlayerColor ] = useState<PlayerColor>(() => {
    const rand = Math.floor(Math.random() * 2); // generate either 0 or 1, 50/50 chance
    return (rand === 0 ? "white" : "black");
  });

  const [ board, setBoard ] = useState<Board | null>(null);

  // for our players current clicked piece, after it is set (when the player clicks a piece), they can move the piece by clicking a valid square
  const [ clickedPiece, setClickedPiece ] = useState<Position | null>(null);

  const [ moveError, setMoveError ] = useState<Position | null>(null);

  useEffect(() => {
    setBoard(new Board(playerColor));
  }, [playerColor]);

  return (
    <div className="flex flex-col items-center justify-center w-5/12 aspect-square max-h-[calc(100%-2rem)]">
      {board?.boardMatrix.map((arr, r) => (
        <div key={r} className="flex flex-row w-full flex-1">
          {arr.map((el, c) => (
            <div 
              key={c} 
              className="flex-1 relative" 
              style={{ backgroundColor: `${(r === 0 || r % 2 === 0) ? 
                (c === 0 || c % 2 ===0 ? "rgb(235, 236, 208)" : "rgb(115, 149, 82)") :
                (c === 0 || c % 2 ===0 ? "rgb(115, 149, 82)" : "rgb(235, 236, 208)")}
              `}}
              onClick={() => handleClick({r: r, c: c}, board, playerColor, turn, clickedPiece, setClickedPiece, setTurn, setBoard, setMoveError)}
            >
              {el && (
                <div className="absolute inset-0 pointer-events-none">
                  <PieceImage type={el.type} color={el.color} />
                </div>
              )}
              {((moveError?.r === r && moveError?.c === c) || (clickedPiece?.r === r && clickedPiece?.c === c)) && (
                <div className="absolute inset-0 pointer-events-none bg-red-500/20">
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};
