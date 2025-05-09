"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Pawn, Rook, Knight, Bishop, Queen, King, Piece, PieceImage, Color } from "./piece";

type PlayerColor = "white" | "black";

class Board {
  boardMatrix: (Piece | null)[][];

  constructor(pc: PlayerColor) {
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
}

export default function gameBoard() {
  // current players turn
  const [ turn, setTurn ] = useState<"white" | "black">("white"); // white always starts first in chess

  // our players color
  const [ playerColor, setPlayerColor ] = useState<PlayerColor>(() => {
    const rand = Math.floor(Math.random() * 2); // generate either 0 or 1, 50/50 chance
    return (rand === 0 ? "white" : "black");
  });

  const [ board, setBoard ] = useState<Board>(new Board(playerColor));

  useEffect(() => {
    
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-5/12 aspect-square max-h-[calc(100%-2rem)]">
      {board.boardMatrix.map((arr, r) => (
        <div key={r} className="flex flex-row w-full flex-1">
          {arr.map((el, c) => (
            <div 
              key={c} 
              className="flex-1 relative" 
              style={{ backgroundColor: `${(r === 0 || r % 2 === 0) ? 
                (c === 0 || c % 2 ===0 ? "rgb(235, 236, 208)" : "rgb(115, 149, 82)") :
                (c === 0 || c % 2 ===0 ? "rgb(115, 149, 82)" : "rgb(235, 236, 208)")}
              `}}
            >
              {el && <PieceImage type={el.type} color={el.color} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};
