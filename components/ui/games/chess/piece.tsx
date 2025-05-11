import Image from "next/image";
import react from "react";
import type { PlayerColor } from "./game-board";
import { Position, Board } from "./game-board";

type PieceType = "Pawn" | "Rook" | "Knight" | "Bishop" | "Queen" | "King";
export interface Piece {
  type: PieceType;
  color: PlayerColor;
  updateBoard: (currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) => void;
  move: (currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) => boolean; // returns success or fail
};

export class Pawn implements Piece {
  type: PieceType;
  color: PlayerColor;

  constructor(col: PlayerColor) {
    this.type = "Pawn";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    console.log(currentPos);
    console.log(toPos);
    // CASE 1: pawn is moving into open spot forward (1 or 2 spaces forward)
    if (currentPos.c === toPos.c) {
      // moving forward 1 space into open spot
      if (currentPos.r === toPos.r+1 && !board.boardMatrix[toPos.r][toPos.c]) {
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
      // moving forward 2 spaces into open spot
      if (currentPos.r === toPos.r+2 && !board.boardMatrix[toPos.r][toPos.c] && !board.boardMatrix[toPos.r+1][toPos.c] && currentPos.r === 6) {
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
    }

    // CASE 2: diagonal move  --------------------------------------------------------------------------------------------------------STILL NEEDS TESTING
    if ((currentPos.c === toPos.c-1 || currentPos.c === toPos.c+1) && (currentPos.r === toPos.r+1) && (board.boardMatrix[toPos.r][toPos.c] && board.boardMatrix[toPos.r][toPos.c].color !== this.color)) {
      console.log("moving diagonal");
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    return false;
  }
}

export class Rook implements Piece {
  type: PieceType;
  color: PlayerColor;

  constructor(col: PlayerColor) {
    this.type = "Rook";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    return true;
  }
}

export class Knight implements Piece {
  type: PieceType;
  color: PlayerColor;
  
  constructor(col: PlayerColor) {
    this.type = "Knight";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    return true;
  }
}

export class Bishop implements Piece {
  type: PieceType;
  color: PlayerColor;
  
  constructor(col: PlayerColor) {
    this.type = "Bishop";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    const temp = board.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(temp);
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    return true;
  }
}

export class Queen implements Piece {
  type: PieceType;
  color: PlayerColor;
  
  constructor(col: PlayerColor) {
    this.type = "Queen";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    const temp = board.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(temp);
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    return true;
  }
}

export class King implements Piece {
  type: PieceType;
  color: PlayerColor;
  
  constructor(col: PlayerColor) {
    this.type = "King";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    const temp = board.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(temp);
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board>>) {
    return true;
  }
}

interface PieceImageProps {
  type: PieceType,
  color: PlayerColor,
}

const typeToPieceLetter: Record<PieceType, String> = {
  "Pawn": "p",
  "Rook": "r",
  "Knight": "n",
  "Bishop": "b",
  "Queen": "q",
  "King": "k",
}

export const PieceImage: React.FC<PieceImageProps> = ({ type, color}) => {
  return (
    <div className="">
      <Image
        src={`/game-icons/chess/${color === "white" ? "w" : "b"}${typeToPieceLetter[type]}.png`}
        alt="bp"
        fill 
        className="object-contain"
      />
    </div>
  );
}
