import Image from "next/image";
import react from "react";

type PieceType = "Pawn" | "Rook" | "Knight" | "Bishop" | "Queen" | "King";
export type Color = "white" | "black";

export interface Piece {
  type: PieceType;
  // color and position are instantiated when the game starts 
  color: Color;
};

export class Pawn implements Piece {
  type: PieceType;
  color: Color;

  constructor(col: Color) {
    this.type = "Pawn";
    this.color = col;
  };
}

export class Rook implements Piece {
  type: PieceType;
  color: Color;

  constructor(col: Color) {
    this.type = "Rook";
    this.color = col;
  };
}

export class Knight implements Piece {
  type: PieceType;
  color: Color;
  
  constructor(col: Color) {
    this.type = "Knight";
    this.color = col;
  };
}

export class Bishop implements Piece {
  type: PieceType;
  color: Color;
  
  constructor(col: Color) {
    this.type = "Bishop";
    this.color = col;
  };
}

export class Queen implements Piece {
  type: PieceType;
  color: Color;
  
  constructor(col: Color) {
    this.type = "Queen";
    this.color = col;
  };
}

export class King implements Piece {
  type: PieceType;
  color: Color;
  
  constructor(col: Color) {
    this.type = "King";
    this.color = col;
  };
}

interface PieceImageProps {
  type: PieceType,
  color: Color,
}

const typeToPieceLetter: Record<PieceType, String> = {
  "Pawn": "p",
  "Rook": "r",
  "Knight": "n",
  "Bishop": "b",
  "Queen": "q",
  "King": "k",
}

export const PieceImage: React.FC<PieceImageProps> = ({ type, color }) => {
  return (
    <Image
      src={`/game-icons/chess/${color === "white" ? "w" : "b"}${typeToPieceLetter[type]}.png`}
      alt="bp"
      fill 
      className="object-contain"
    />
  );
}
