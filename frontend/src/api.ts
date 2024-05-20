import { createSignal, batch } from "solid-js";

const API_URL = import.meta.env.DEV
  ? "http://localhost:2137/api"
  : window.location.origin + "/api";

export enum GameState {
  MENU,
  QUEUE,
  PLAYING,
}

type SocketMessage
  = { type: "GameStart", payload: boolean } // True if player is X; false if player is O
  | { type: "OpponentMove", payload: number }
  | { type: "OpponentForfeit" };

export const [ gameState, setGameState ] = createSignal(GameState.MENU);
export const [ board, setBoard ] = createSignal([0, 0, 0, 0, 0, 0, 0, 0, 0]);
export const [ player, setPlayer ] = createSignal(0); // 0 = O, 1 = X
export const [ hasWon, setHasWon ] = createSignal<boolean | null>(null);


let socket: WebSocket | null = null;
export async function joinQueue() {
  batch(() => {
    setGameState(GameState.QUEUE);
    setBoard([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    setPlayer(0);
    setHasWon(null);
  });

  socket = new WebSocket(API_URL + "/queue");
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data) as SocketMessage;
    switch (message.type) {
      case "GameStart":
        batch(() => {
          setGameState(GameState.PLAYING);
          setPlayer(message.payload ? 1 : 0);
        });
        break;

      case "OpponentMove":
        batch(() => {
          const newBoard = board();
          newBoard[message.payload] = player() === 0 ? 1 : 2;
          setBoard(newBoard);
        });
        break;

      case "OpponentForfeit":
        batch(() => {
          setHasWon(true);
          socket?.close();
        });
        break;
    }
  }
}

export function place(field: number) {
  if (board()[field] !== 0 || gameState() !== GameState.PLAYING) return;

  const newBoard = board();
  newBoard[field] = player();
  
  setBoard(newBoard);
  socket?.send(JSON.stringify({ type: "Move", payload: field }));
}
