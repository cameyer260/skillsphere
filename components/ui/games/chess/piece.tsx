import Image from "next/image";
import react from "react";
import type { PlayerColor } from "./game-board";
import { Position, Board } from "./game-board";

type PieceType = "Pawn" | "Rook" | "Knight" | "Bishop" | "Queen" | "King";
export interface Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved?: boolean;
  updateBoard: (currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) => void;
  move: (currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) => boolean; // returns success or fail
};

export class Pawn implements Piece {
  type: PieceType;
  color: PlayerColor;

  constructor(col: PlayerColor) {
    this.type = "Pawn";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    if (currentPos.r === toPos.r && currentPos.c === toPos.c) return false; // if they click the same square they are on return false early
    // CASE 1: pawn is moving into open spot forward (1 or 2 spaces forward)
    if (currentPos.c === toPos.c) {
      // moving forward 1 space into open spot
      if (currentPos.r === toPos.r + 1 && !board.boardMatrix[toPos.r][toPos.c]) {
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
      // moving forward 2 spaces into open spot
      if (currentPos.r === toPos.r + 2 && !board.boardMatrix[toPos.r][toPos.c] && !board.boardMatrix[toPos.r + 1][toPos.c] && currentPos.r === 6) {
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
    }

    // CASE 2: diagonal move
    if ((currentPos.c === toPos.c - 1 || currentPos.c === toPos.c + 1) && (currentPos.r === toPos.r + 1) && (board.boardMatrix[toPos.r][toPos.c] && board.boardMatrix[toPos.r][toPos.c]?.color !== this.color)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    return false;
  }
}

export class Rook implements Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved: boolean; // boolean in Rook and King for castling

  constructor(col: PlayerColor) {
    this.type = "Rook";
    this.color = col;
    this.hasMoved = false;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    if (currentPos.r === toPos.r && currentPos.c === toPos.c) return false; // if they click the same square they are on return false early
    // CASE 0: castling (check before checking if they are trying to take their own piece)
    if (board.boardMatrix[toPos.r][toPos.c]?.type === "King") {
      if (!this.hasMoved && !board.boardMatrix[toPos.r][toPos.c]?.hasMoved) {
        let success = true;
        if (currentPos.c > toPos.c) { // right rook castling left
          for (let i = currentPos.c - 1; i > toPos.c; i--) {
            if (board.boardMatrix[currentPos.r][i]) success = false;
          }
          if (success) {
            // modified updateBoard method
            const temp = board.boardMatrix.map(row => [...row]);
            temp[7][5] = temp[7][7];
            temp[7][7] = null;
            temp[7][6] = temp[7][4];
            temp[7][4] = null;
            setBoard(new Board(this.color, temp));
            return true;
          }
        } else { // left rook castling right
          for (let i = currentPos.c + 1; i < toPos.c; i++) {
            if (board.boardMatrix[currentPos.r][i]) success = false;
          }
          if (success) {
            // modified updateBoard method
            const temp = board.boardMatrix.map(row => [...row]);
            temp[7][3] = temp[7][0];
            temp[7][0] = null;
            temp[7][2] = temp[7][4];
            temp[7][4] = null;
            setBoard(new Board(this.color, temp));
            return true;
          }
        }
      }
    }
    if (board.boardMatrix[toPos.r][toPos.c]?.color === this.color) return false; // if they are trying to take their own piece return false early
    // CASE 1: horizontal move
    if (currentPos.r === toPos.r) {
      if (toPos.c > currentPos.c) {
        // moving right
        for (let i = currentPos.c + 1; i < toPos.c; i++) {
          if (board.boardMatrix[currentPos.r][i]) return false; // if there are any pieces blocking the path return false
        }
        // if false not returned we have reached success
        this.updateBoard(currentPos, toPos, board, setBoard);
        this.hasMoved = true;
        return true;
      } else {
        // moving left
        for (let i = currentPos.c - 1; i > toPos.c; i--) {
          if (board.boardMatrix[currentPos.r][i]) return false; // if there are any pieces blocking the path return false
        }
        // if false not returned we have reached success
        this.updateBoard(currentPos, toPos, board, setBoard);
        this.hasMoved = true;
        return true;
      }
    } else if (currentPos.c === toPos.c) { // CASE 2: vertical move
      if (toPos.r > currentPos.r) {
        // moving downward
        for (let i = currentPos.r + 1; i < toPos.r; i++) {
          if (board.boardMatrix[i][currentPos.c]) return false; // if there are any pieces blocking the path return false
        }
        // if false not returned we have reached success
        this.updateBoard(currentPos, toPos, board, setBoard);
        this.hasMoved = true;
        return true;
      } else {
        // moving upward
        for (let i = currentPos.r - 1; i > toPos.r; i--) {
          if (board.boardMatrix[i][currentPos.c]) return false; // if there are any pieces blocking the path return false
        }
        // if false not returned we have reached success
        this.updateBoard(currentPos, toPos, board, setBoard);
        this.hasMoved = true;
        return true;
      }
    }
    return false;
  }
}

export class Knight implements Piece {
  type: PieceType;
  color: PlayerColor;

  constructor(col: PlayerColor) {
    this.type = "Knight";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    if (currentPos.r === toPos.r && currentPos.c === toPos.c) return false; // if they click the same square they are on return false early
    if (board.boardMatrix[toPos.r][toPos.c]?.color === this.color) return false; // if they are trying to take their own piece return false early

    // CASE 1: moving up left
    if ((toPos.r === currentPos.r - 2 && toPos.c === currentPos.c - 1) || (toPos.r === currentPos.r - 1 && toPos.c === currentPos.c - 2)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    // CASE 2: moving up right 
    if ((toPos.r === currentPos.r - 2 && toPos.c === currentPos.c + 1) || (toPos.r === currentPos.r - 1 && toPos.c === currentPos.c + 2)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    // CASE 3: moving down left
    if ((toPos.r === currentPos.r + 2 && toPos.c === currentPos.c - 1) || (toPos.r === currentPos.r + 1 && toPos.c === currentPos.c - 2)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    // CASE 4: moving down right
    if ((toPos.r === currentPos.r + 2 && toPos.c === currentPos.c + 1) || (toPos.r === currentPos.r + 1 && toPos.c === currentPos.c + 2)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    return false;
  }
}

export class Bishop implements Piece {
  type: PieceType;
  color: PlayerColor;

  constructor(col: PlayerColor) {
    this.type = "Bishop";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    if (currentPos.r === toPos.r && currentPos.c === toPos.c) return false; // if they click the same square they are on return false early
    if (board.boardMatrix[toPos.r][toPos.c]?.color === this.color) return false; // if they are trying to take their own piece return false early
    if (Math.abs(currentPos.r - toPos.r) === Math.abs(currentPos.c - toPos.c)) { // if the absolute value of the difference of row index and column index the spots are diagonal
      // CASE 1: move up right
      if (toPos.r < currentPos.r && toPos.c > currentPos.c) {
        for (let i = 1; i < Math.abs(currentPos.r - toPos.r); i++) { // i represent the # of diagonal spots traveled
          if (board.boardMatrix[currentPos.r - i][currentPos.c + 1]) return false;
        }
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
      // CASE 2: move up left
      if (toPos.r < currentPos.r && toPos.c < currentPos.c) {
        for (let i = 1; i < Math.abs(currentPos.r - toPos.r); i++) { // i represent the # of diagonal spots traveled
          if (board.boardMatrix[currentPos.r - i][currentPos.c - 1]) return false;
        }
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
      // CASE 3: move down right
      if (toPos.r > currentPos.r && toPos.c > currentPos.c) {
        for (let i = 1; i < Math.abs(currentPos.r - toPos.r); i++) { // i represent the # of diagonal spots traveled
          if (board.boardMatrix[currentPos.r + i][currentPos.c + 1]) return false;
        }
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
      // CASE 4: move down left
      if (toPos.r > currentPos.r && toPos.c < currentPos.c) {
        for (let i = 1; i < Math.abs(currentPos.r - toPos.r); i++) { // i represent the # of diagonal spots traveled
          if (board.boardMatrix[currentPos.r + i][currentPos.c - 1]) return false;
        }
        this.updateBoard(currentPos, toPos, board, setBoard);
        return true;
      }
    }
    return false;
  }
}

export class Queen implements Piece {
  type: PieceType;
  color: PlayerColor;

  constructor(col: PlayerColor) {
    this.type = "Queen";
    this.color = col;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    if (currentPos.r === toPos.r && currentPos.c === toPos.c) return false; // if they click the same square they are on return false early
    if (board.boardMatrix[toPos.r][toPos.c]?.color === this.color) return false; // if they are trying to take their own piece return false early
    // Queen is able to move like a rook and bishop, so just create temp pieces of those and if their moves move functions return true then it's a success
    let tempRook = new Rook(this.color);
    if (tempRook.move(currentPos, toPos, board, setBoard)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    let tempBishop = new Bishop(this.color);
    if (tempBishop.move(currentPos, toPos, board, setBoard)) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      return true;
    }
    return false;
  }
}

export class King implements Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved: boolean;

  constructor(col: PlayerColor) {
    this.type = "King";
    this.color = col;
    this.hasMoved = false;
  };

  updateBoard(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    const temp = board.boardMatrix.map(row => [...row]);
    temp[toPos.r][toPos.c] = temp[currentPos.r][currentPos.c];
    temp[currentPos.r][currentPos.c] = null;
    setBoard(new Board(this.color, temp));
  }

  move(currentPos: Position, toPos: Position, board: Board, setBoard: React.Dispatch<React.SetStateAction<Board | null>>) {
    if (currentPos.r === toPos.r && currentPos.c === toPos.c) return false; // if they click the same square they are on return false early
    // CASE 0: castling (check before checking if they are trying to take their own piece)
    if (board.boardMatrix[toPos.r][toPos.c]?.type === "Rook") {
      if (!this.hasMoved && !board.boardMatrix[toPos.r][toPos.c]?.hasMoved) {
        let success = true;
        if (currentPos.c > toPos.c) { // right rook castling left
          for (let i = currentPos.c - 1; i > toPos.c; i--) {
            if (board.boardMatrix[currentPos.r][i]) success = false;
          }
          if (success) {
            // modified updateBoard method
            const temp = board.boardMatrix.map(row => [...row]);
            temp[7][3] = temp[7][0];
            temp[7][0] = null;
            temp[7][2] = temp[7][4];
            temp[7][4] = null;
            setBoard(new Board(this.color, temp));
            return true;

          }
        } else { // left rook castling right
          for (let i = currentPos.c + 1; i < toPos.c; i++) {
            if (board.boardMatrix[currentPos.r][i]) success = false;
          }
          if (success) {
            // modified updateBoard method
            const temp = board.boardMatrix.map(row => [...row]);
            temp[7][5] = temp[7][7];
            temp[7][7] = null;
            temp[7][6] = temp[7][4];
            temp[7][4] = null;
            setBoard(new Board(this.color, temp));
            return true;
          }
        }
      }
    }
    if (board.boardMatrix[toPos.r][toPos.c]?.color === this.color) return false; // if they are trying to take their own piece return false early
    // check pieces brute force, go in order of counter clockwise starting at top left square
    let success = false;
    if (toPos.r === currentPos.r - 1 && toPos.c === currentPos.c - 1) success = true;
    if (toPos.r === currentPos.r && toPos.c === currentPos.c - 1) success = true;
    if (toPos.r === currentPos.r + 1 && toPos.c === currentPos.c - 1) success = true;
    if (toPos.r === currentPos.r + 1 && toPos.c === currentPos.c) success = true;
    if (toPos.r === currentPos.r + 1 && toPos.c === currentPos.c + 1) success = true;
    if (toPos.r === currentPos.r && toPos.c === currentPos.c + 1) success = true;
    if (toPos.r === currentPos.r - 1 && toPos.c === currentPos.c + 1) success = true;
    if (toPos.r === currentPos.r - 1 && toPos.c === currentPos.c) success = true;
    if (success === true) {
      this.updateBoard(currentPos, toPos, board, setBoard);
      this.hasMoved = true;
    }

    return success;
  }
}

interface PieceImageProps {
  type: PieceType,
  color: PlayerColor,
}

export const typeToPieceLetter: Record<PieceType, String> = {
  "Pawn": "p",
  "Rook": "r",
  "Knight": "n",
  "Bishop": "b",
  "Queen": "q",
  "King": "k",
}

export const PieceImage: React.FC<PieceImageProps> = ({ type, color }) => {
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
