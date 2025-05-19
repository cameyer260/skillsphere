"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pawn, Rook, Knight, Bishop, Queen, King, Piece, PieceImage, typeToPieceLetter } from "./piece";

export type PlayerColor = "white" | "black";

export interface Position {
  r: number,
  c: number,
}
export interface Move {
  from: Position;
  to: Position;
};


export class Board {
  boardMatrix: (Piece | null)[][];
  constructor(pc: PlayerColor, bM?: (Piece | null)[][]) {
    if (bM) {
      this.boardMatrix = bM;
      return;
    }
    // for testing
    // let temp = [
    //   (pc === "white" ? ['x', 'x', 'x', 'x', 'K', 'x', 'x', 'x'] : ['x', 'x', 'x', 'K', 'x', 'x', 'x', 'x']),
    //   ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    //   ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    //   ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    //   ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    //   ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    //   ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    //   (pc === "white" ? ['r', 'k', 'b', 'q', 'K', 'b', 'k', 'r'] : ['r', 'k', 'b', 'K', 'q', 'b', 'k', 'r']),
    // ];
    let temp = [
      (pc === "white" ? ['r', 'k', 'b', 'q', 'K', 'b', 'k', 'r'] : ['r', 'k', 'b', 'K', 'q', 'b', 'k', 'r']),
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      (pc === "white" ? ['r', 'k', 'b', 'q', 'K', 'b', 'k', 'r'] : ['r', 'k', 'b', 'K', 'q', 'b', 'k', 'r']),
    ];
    this.boardMatrix = temp.map((arr, row) => {
      const color = (pc === "white" ? (row < 2 ? "black" : "white") : (row < 2 ? "white" : "black"));
      return arr.map((el) => {
        switch (el) {
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

const getCastlingInfo = (board: Board, realPlayerColor: PlayerColor) => {
  let castlingInfo = "";
  if (realPlayerColor === "white") {
    if (board.boardMatrix[7][4]?.hasMoved === false) { // first check if king has moved, if it has we can bypass adding any castling availability for the white side
      if (board.boardMatrix[7][7]?.hasMoved === false) castlingInfo += "K";
      if (board.boardMatrix[7][0]?.hasMoved === false) castlingInfo += "Q";
    }
    if (board.boardMatrix[0][4]?.hasMoved === false) {
      if (board.boardMatrix[0][7]?.hasMoved === false) castlingInfo += "k";
      if (board.boardMatrix[0][0]?.hasMoved === false) castlingInfo += "q";
    }
  } else {
    if (board.boardMatrix[0][3]?.hasMoved === false) { // first check if king has moved, if it has we can bypass adding any castling availability for the white side
      if (board.boardMatrix[0][0]?.hasMoved === false) castlingInfo += "K";
      if (board.boardMatrix[0][7]?.hasMoved === false) castlingInfo += "Q";
    }
    if (board.boardMatrix[7][3]?.hasMoved === false) {
      if (board.boardMatrix[7][0]?.hasMoved === false) castlingInfo += "k";
      if (board.boardMatrix[7][7]?.hasMoved === false) castlingInfo += "q";
    }
  }
  if (!castlingInfo) return "-";
  return castlingInfo;
}

const getFENChar = (piece: Piece) => {
  let char = typeToPieceLetter[piece.type];
  if (piece.color === "white") {
    char = char.toUpperCase();
  }
  return char;
}

/**
 * converts the board to an FEN string
 * @param {Board | null} board - the board object
 * @param {PlayerColor} playerToMove - the turn of the game
 * @param {PlayerColor} realPlayerColor - the color of the actual human playing on the client side
 */
const boardToFEN = (
  board: Board | null,
  playerToMove: PlayerColor,
  realPlayerColor: PlayerColor
) => {
  if (!board) return;
  let fen = "";
  // Determine the row order based on player color
  const rows = realPlayerColor === "white"
    ? board.boardMatrix
    : [...board.boardMatrix].reverse(); // reverse rows for black
  for (let row of rows) {
    let emptyCount = 0;
    // Determine the column order based on player color
    const cells = realPlayerColor === "white"
      ? row
      : [...row].reverse(); // reverse columns for black
    for (let cell of cells) {
      if (!cell) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        const pieceLetter = getFENChar(cell);
        fen += pieceLetter;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    fen += "/";
  }
  fen = fen.slice(0, -1); // remove last slash
  const turn = playerToMove === "white" ? "w" : "b";
  const castling = getCastlingInfo(board, realPlayerColor);
  fen += ` ${turn} ${castling} - 0 1`;
  return fen;
};

const getBestMove = async (fen: string | undefined, pc: PlayerColor) => {
  try {
    console.log(fen);
    if (!fen) throw new Error('Error converting board to FEN string');
    const response = await fetch("https://chess-api.com/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fen: fen }),
    });
    const result = await response.json();
    console.log(result);
    const from = result.from;
    const to = result.to;
    if (!from || !to) throw new Error("Bad response");
    // now harvest a currentPosition and toPosition out of these strings (format of: ex. "b5") and return them in an array of two objects, index 0 is fromPosition, index 1 is toPoisiton
    if (pc === "white") {
      const fromCol = from[0].toLowerCase().charCodeAt(0) - 97; // a = 0, b = 1, ...
      const fromRow = 8 - from[1];
      const toCol = to[0].toLowerCase().charCodeAt(0) - 97;
      const toRow = 8 - to[1];
      return [
        {
          r: fromRow,
          c: fromCol
        },
        {
          r: toRow,
          c: toCol
        }
      ];
    } else {
      const fromCol = 7 - (from[0].toLowerCase().charCodeAt(0) - 97); // a = 0, b = 1, ...
      const fromRow = from[1] - 1;
      const toCol = 7 - (to[0].toLowerCase().charCodeAt(0) - 97);
      const toRow = to[1] - 1;
      return [
        {
          r: fromRow,
          c: fromCol
        },
        {
          r: toRow,
          c: toCol
        }
      ];
    }
  } catch (error) {
    console.log("there is an error");
    console.log(error); // temp for development
    return false;
  }
}

const handleMove = (
  position: Position,
  board: Board,
  turn: PlayerColor,
  clickedPiece: Position | null,
  setClickedPiece: React.Dispatch<React.SetStateAction<Position | null>>,
  setTurn: React.Dispatch<React.SetStateAction<PlayerColor>>,
  setBoard: React.Dispatch<React.SetStateAction<Board | null>>,
  setMoveError: React.Dispatch<React.SetStateAction<Position | null>>,
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
    }, 500);
    setClickedPiece(null); // set clicked piece to null on success or failure to move piece

    return; // exit function without updating turn because on failure to move turn does not change
  }
  // update states assuming success
  setTurn(turn === "white" ? "black" : "white");
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
  setBoard: React.Dispatch<React.SetStateAction<Board | null>>,
  setMoveError: React.Dispatch<React.SetStateAction<Position | null>>,
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
  handleMove(position, board, turn, clickedPiece, setClickedPiece, setTurn, setBoard, setMoveError);
};

export default function gameBoard() {
  // current players turn
  const [turn, setTurn] = useState<PlayerColor>("white"); // white always starts first in chess
  // our players color
  const [playerColor, setPlayerColor] = useState<PlayerColor>(() => {
    const rand = Math.floor(Math.random() * 2); // generate either 0 or 1, 50/50 chance
    return (rand === 0 ? "white" : "black");
  });
  const [board, setBoard] = useState<Board | null>(null);
  // for our players current clicked piece, after it is set (when the player clicks a piece), they can move the piece by clicking a valid square
  const [clickedPiece, setClickedPiece] = useState<Position | null>(null);
  const [moveError, setMoveError] = useState<Position | null>(null);
  const [inCheck, setInCheck] = useState<PlayerColor | null>(null); // null when no one is in check
  const [checkmate, setCheckmate] = useState<PlayerColor | null>(null) // null when no one is in checkmate
  const router = useRouter();

  useEffect(() => {
    setBoard(new Board(playerColor));
  }, []);

  /**
    * Handles bot turn and also handles check logic. Runs on each turn.
    */
  useEffect(() => {
    const simulateThinking = () => {
      let ms = Math.random() * 3000 + 1000;
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const botTurn = async () => {
      try {
        if (!board) return;
        const response = await getBestMove(boardToFEN(board, turn, playerColor), playerColor);
        if (!response) throw new Error("Bad response");
        console.log(response);
        const fromPos = response[0];
        const toPos = response[1];
        await simulateThinking();
        if (!board.boardMatrix[fromPos.r][fromPos.c]?.botMove(fromPos, toPos, board, setBoard)) throw new Error("Invalid bot move");
        setTurn(turn === "white" ? "black" : "white");
        return;
      } catch (error) {
        // if there is an error in the response and the bot is in check we can be confident we have reached checkmate
        if (playerInCheck && playerColor !== playerInCheck) {
          setCheckmate(playerInCheck);
          return;
        }
        // check if the bot is in check
        // if they are and the api returned an error response we can be confident the bot is in checkmate
        alert("The chess bot is not working currently. You may have reached the rate limit for today. Please try again later.");
        router.push("/protected");
        return;
      }
    };
    const findKings = () => {
      // iterates through board and finds both kings
      if (!board) return;
      let foundBK: Position | null = null;
      let foundWK: Position | null = null;
      for (let r = 0; r < board?.boardMatrix.length; r++) {
        for (let c = 0; c < board?.boardMatrix[r].length; c++) {
          if (board.boardMatrix[r][c]?.type === "King") {
            board.boardMatrix[r][c]?.color === "white" ?
              foundWK = {
                r: r,
                c: c
              } :
              foundBK = {
                r: r,
                c: c,
              };
          }
        }
      }
      return [foundBK, foundWK];
    };
    const checkDiagonals = (pos: Position, color: PlayerColor) => {
      if (!board) return false;
      // let's check for pawns first because for that orientation of board matters so we must check if they are the bot or not
      if (color === playerColor) {
        // human player, starts at bottom of board
        if ((board.boardMatrix[pos.r - 1][pos.c - 1] && board.boardMatrix[pos.r - 1][pos.c - 1]?.color !== color && board.boardMatrix[pos.r - 1][pos.c - 1]?.type === "Pawn") ||
          (board.boardMatrix[pos.r - 1][pos.c + 1] && board.boardMatrix[pos.r - 1][pos.c + 1]?.color !== color && board.boardMatrix[pos.r - 1][pos.c + 1]?.type === "Pawn")) return true;
      } else {
        // bot player, starts at top of board
        if ((board.boardMatrix[pos.r + 1][pos.c - 1] && board.boardMatrix[pos.r + 1][pos.c - 1]?.color !== color && board.boardMatrix[pos.r + 1][pos.c - 1]?.type === "Pawn") ||
          (board.boardMatrix[pos.r + 1][pos.c + 1] && board.boardMatrix[pos.r + 1][pos.c + 1]?.color !== color && board.boardMatrix[pos.r + 1][pos.c + 1]?.type === "Pawn")) return true;
      }
      // now we can check diagonals for bishops and queens
      // start with upper right diagonal
      let i = 1;
      while (board.boardMatrix[pos.r + i]?.[pos.c + i] === null) i++;
      if (board.boardMatrix[pos.r + i]?.[pos.c + i]
        && board.boardMatrix[pos.r + i]?.[pos.c + i]?.color !== color
        && (board.boardMatrix[pos.r + i]?.[pos.c + i]?.type === "Bishop" || board.boardMatrix[pos.r + i]?.[pos.c + i]?.type === "Queen"))
        return true;
      // now we'll check upper left diagonal
      i = 1;
      while (board.boardMatrix[pos.r + i]?.[pos.c - i] === null) i++;
      if (board.boardMatrix[pos.r + i]?.[pos.c - i]
        && board.boardMatrix[pos.r + i]?.[pos.c - i]?.color !== color
        && (board.boardMatrix[pos.r + i]?.[pos.c - i]?.type === "Bishop" || board.boardMatrix[pos.r + i]?.[pos.c - i]?.type === "Queen"))
        return true;
      // now we'll check lower left diagonal
      i = 1;
      while (board.boardMatrix[pos.r - i]?.[pos.c - i] === null) i++;
      if (board.boardMatrix[pos.r - i]?.[pos.c - i]
        && board.boardMatrix[pos.r - i]?.[pos.c - i]?.color !== color
        && (board.boardMatrix[pos.r - i]?.[pos.c - i]?.type === "Bishop" || board.boardMatrix[pos.r - i][pos.c - i]?.type === "Queen"))
        return true;
      // now we'll check lower right diagonal
      i = 1;
      while (board.boardMatrix[pos.r - i]?.[pos.c + i] === null) i++;
      if (board.boardMatrix[pos.r - i]?.[pos.c + i]
        && board.boardMatrix[pos.r - i]?.[pos.c + i]?.color !== color
        && (board.boardMatrix[pos.r - i]?.[pos.c + i]?.type === "Bishop" || board.boardMatrix[pos.r - i]?.[pos.c + i]?.type === "Queen"))
        return true;
      return false;
    };
    const checkStraights = (pos: Position, color: PlayerColor) => {
      if (!board) return false;
      // first check down
      let i = 1;
      while (board.boardMatrix[pos.r + i]?.[pos.c] === null) i++;
      if (board.boardMatrix[pos.r + i]?.[pos.c]
        && board.boardMatrix[pos.r + i]?.[pos.c]?.color !== color
        && (board.boardMatrix[pos.r + i]?.[pos.c]?.type === "Rook" || board.boardMatrix[pos.r + i]?.[pos.c]?.type === "Queen"))
        return true;
      // then check left
      i = 1;
      while (board.boardMatrix[pos.r]?.[pos.c - i] === null) i++;
      if (board.boardMatrix[pos.r]?.[pos.c - i]
        && board.boardMatrix[pos.r]?.[pos.c - i]?.color !== color
        && (board.boardMatrix[pos.r]?.[pos.c - i]?.type === "Rook" || board.boardMatrix[pos.r]?.[pos.c - i]?.type === "Queen"))
        return true;
      // then check up
      i = 1;
      while (board.boardMatrix[pos.r - i]?.[pos.c] === null) i++;
      if (board.boardMatrix[pos.r - i]?.[pos.c]
        && board.boardMatrix[pos.r - i]?.[pos.c]?.color !== color
        && (board.boardMatrix[pos.r - i]?.[pos.c]?.type === "Rook" || board.boardMatrix[pos.r - i]?.[pos.c]?.type === "Queen"))
        return true;
      // then check right
      i = 1;
      while (board.boardMatrix[pos.r]?.[pos.c + i] === null) i++;
      if (board.boardMatrix[pos.r]?.[pos.c + i]
        && board.boardMatrix[pos.r]?.[pos.c + i]?.color !== color
        && (board.boardMatrix[pos.r]?.[pos.c + i]?.type === "Rook" || board.boardMatrix[pos.r]?.[pos.c + i]?.type === "Queen"))
        return true;
      return false;
    };
    const checkHorses = (pos: Position, color: PlayerColor) => {
      if (!board) return false;
      // brute force check
      // first check upmost left
      if (board.boardMatrix[pos.r - 2]?.[pos.c - 1] && board.boardMatrix[pos.r - 2]?.[pos.c - 1]?.color !== color && board.boardMatrix[pos.r - 2]?.[pos.c - 1]?.type === "Knight") return true;
      // then check upmost right
      if (board.boardMatrix[pos.r - 2]?.[pos.c + 1] && board.boardMatrix[pos.r - 2]?.[pos.c + 1]?.color !== color && board.boardMatrix[pos.r - 2]?.[pos.c + 1]?.type === "Knight") return true;
      // then check rightmost up
      if (board.boardMatrix[pos.r - 1]?.[pos.c + 2] && board.boardMatrix[pos.r - 1]?.[pos.c + 2]?.color !== color && board.boardMatrix[pos.r - 1]?.[pos.c + 2]?.type === "Knight") return true;
      // then check rightmost down
      if (board.boardMatrix[pos.r + 1]?.[pos.c + 2] && board.boardMatrix[pos.r + 1]?.[pos.c + 2]?.color !== color && board.boardMatrix[pos.r + 1]?.[pos.c + 2]?.type === "Knight") return true;
      // then check downmost right
      if (board.boardMatrix[pos.r + 2]?.[pos.c + 1] && board.boardMatrix[pos.r + 2]?.[pos.c + 1]?.color !== color && board.boardMatrix[pos.r + 2]?.[pos.c + 1]?.type === "Knight") return true;
      // then check downmost left
      if (board.boardMatrix[pos.r + 2]?.[pos.c - 1] && board.boardMatrix[pos.r + 2]?.[pos.c - 1]?.color !== color && board.boardMatrix[pos.r + 2]?.[pos.c - 1]?.type === "Knight") return true;
      // then check leftmost down
      if (board.boardMatrix[pos.r + 1]?.[pos.c - 2] && board.boardMatrix[pos.r + 1]?.[pos.c - 2]?.color !== color && board.boardMatrix[pos.r + 1]?.[pos.c - 2]?.type === "Knight") return true;
      // then check leftmost up
      if (board.boardMatrix[pos.r - 1]?.[pos.c - 2] && board.boardMatrix[pos.r - 1]?.[pos.c - 2]?.color !== color && board.boardMatrix[pos.r - 1]?.[pos.c - 2]?.type === "Knight") return true;
      return false;
    };
    const findCheck = () => {
      // end the game if either kings are missing
      const kings = findKings();
      if (!kings) return;
      const bk = kings[0];
      const wk = kings[1];
      if (!bk) {
        alert("White has won!");
        router.push("/protected/play/chess");
        return;
      } else if (!wk) {
        alert("Black has won!");
        router.push("/protected/play/chess");
        return;
      }
      const checkFunctions = [checkDiagonals, checkStraights, checkHorses];
      const isInCheck = (kingPos: Position, color: PlayerColor): boolean => {
        return checkFunctions.some(fn => fn(kingPos, color));
      }
      // now find if either are in check
      if (playerColor === "white") {
        // find if human player is in check first
        if (isInCheck(wk, "white")) {
          setInCheck("white");
          return "white";
        }
        // now find if bot is
        if (isInCheck(bk, "black")) {
          setInCheck("black");
          return "black";
        }
      } else {
        // find if human player is in check first
        if (isInCheck(bk, "black")) {
          setInCheck("black");
          return "black";
        }
        // now find if bot is
        if (isInCheck(wk, "white")) {
          setInCheck("white");
          return "white";
        }
      }
    }
    const getPieceMoves = (pos: Position): Move[] => {
      let moves: Move[] = [];

      return moves;
    };
    const generateLegalMoves = (): Move[] => {
      if (!board) return [];
      let moves: Move[] = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (board.boardMatrix[r][c] && board.boardMatrix[r][c]?.color === playerColor) {
            moves.push(...getPieceMoves({ r: r, c: c }));
          }
        }
      }
      return moves;
    };
    // first find who is in check
    const playerInCheck = findCheck();
    if (turn !== playerColor) botTurn();
    const lms = generateLegalMoves();
    if (lms.length === 0) setCheckmate(playerColor);
  }, [turn, board]);

  useEffect(() => {
    inCheck && alert(`${inCheck} is in check.`);
  }, [inCheck]);

  useEffect(() => {
    // handle checkmate when it happens and end the game
    console.log(checkmate);
    console.log("yo da game is over");
  }, [checkmate]);

  return (
    <div className="flex flex-col items-center justify-center w-5/12 aspect-square max-h-[calc(100%-2rem)]">
      {board?.boardMatrix.map((arr, r) => (
        <div key={r} className="flex flex-row w-full flex-1">
          {arr.map((el, c) => (
            <div
              key={c}
              className="flex-1 relative select-none"
              style={{
                backgroundColor: `${(r === 0 || r % 2 === 0) ?
                  (c === 0 || c % 2 === 0 ? "rgb(235, 236, 208)" : "rgb(115, 149, 82)") :
                  (c === 0 || c % 2 === 0 ? "rgb(115, 149, 82)" : "rgb(235, 236, 208)")}`,
                color: `${(r === 0 || r % 2 === 0) ?
                  (c === 0 || c % 2 === 0 ? "rgb(115, 149, 82)" : "rgb(235, 236, 208)") :
                  (c === 0 || c % 2 === 0 ? "rgb(235, 236, 208)" : "rgb(115, 149, 82)")}`
              }}
              onClick={() => handleClick({ r: r, c: c }, board, playerColor, turn, clickedPiece, setClickedPiece, setTurn, setBoard, setMoveError)}
            >
              {el && (
                <div className="absolute inset-0 pointer-events-none select-none">
                  <PieceImage type={el.type} color={el.color} />
                </div>
              )}
              {((moveError?.r === r && moveError?.c === c) || (clickedPiece?.r === r && clickedPiece?.c === c)) && (
                <div className="absolute inset-0 pointer-events-none bg-red-500/20 selelct-none">
                </div>
              )}
              {(playerColor === "white" ?
                <>
                  {r === 7 && <p className="absolute bottom-0 right-1 pointer-events-none select-none text-xs">{String.fromCharCode(96 + c + 1)}</p>}
                  {c === 0 && <p className="absolute top-0 left-1 pointer-events-none select-none text-xs">{8 - r}</p>}
                </> :
                <>
                  {r === 7 && <p className="absolute bottom-0 right-1 pointer-events-none select-none text-xs">{String.fromCharCode(96 + 7 - c + 1)}</p>}
                  {c === 0 && <p className="absolute top-0 left-1 pointer-events-none select-none text-xs">{r + 1}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};
