import { useState, useEffect, useRef } from "react";

const API = "http://localhost:2137/api";

const listeners: { [key: string]: { [key: string]: () => void } } = {};

export function notify(...types: string[]) {
  types.forEach(type => type in listeners && Object.values(listeners[type]).forEach(update => update()));
}

export function subscribe(type: string, id: string, update: () => void) {
  listeners[type] ??= {};
  listeners[type][id] = update;
}

function unsubscribe(type: string, id: string) {
  delete listeners[type][id];
}

export enum GameState {
  MENU,
  QUEUE,
  PLAYING,
}

type SocketMessage
  = { type: "GameStart", starting: boolean } // True if player is X; false if player is O
  | { type: "OpponentMove", payload: number }
  | { type: "OpponentForfeit" };

let socket: WebSocket | null = null;
let gameState: GameState = GameState.MENU;
let gameBoard: number[] = Array(9).fill(0);
let player: boolean | null = null; // True for X, false for O
let turn: boolean | null = null; // True for player's turn, false for opponent's turn
let hasEnemyForfeited: boolean = false;

export async function joinQueue() {
  socket = new WebSocket(`${API}/queue`);
  gameState = GameState.QUEUE;
  hasEnemyForfeited = false;

  notify("gameState", "enemyForfeit");
  socket.onmessage = event => {
    const message = JSON.parse(event.data) as SocketMessage;
  
    switch (message.type) {
      case "GameStart":
        player = message.starting;
        turn = player;
        gameState = GameState.PLAYING;
        notify("gameState");
        break;

      case "OpponentMove":
        gameBoard[message.payload] = player ? 2 : 1;
        turn = true;
        notify("gameBoard");
        break;

      case "OpponentForfeit":
        hasEnemyForfeited = true;
        notify("enemyForfeit");
        break;
    }
  }
}

export async function leaveQueue() {
  if (gameState !== GameState.QUEUE) {
    return;
  }

  socket?.close();
  socket = null;
  gameState = GameState.MENU;
  notify("gameState");
}

export function makeMove(index: number) {
  if (gameState !== GameState.PLAYING || !turn || gameBoard[index] !== 0) {
    return;
  }

  gameBoard[index] = player ? 1 : 2;
  turn = false;
  notify("gameBoard");

  socket?.send(index.toString());
}

export function closeConnection() {
  socket?.close();
  socket = null;
}

export function goToMenu() {
  closeConnection();
  gameState = GameState.MENU;
  notify("gameState");
}

export function terminate() {
  socket?.send("terminate");
}

export function useGameState() {
  const [ _, update ] = useState(0);
  const refresh = () => update(x => x + 1);

  const id = useRef(Date.now().toString());

  useEffect(() => {
    subscribe("gameState", id.current, refresh);
    return () => unsubscribe("gameState", id.current);
  });

  return [ gameState ] as const;
}

export function useGameBoard() {
  const [ _, update ] = useState(0);
  const refresh = () => update(x => x + 1);

  const id = useRef(Date.now().toString());

  useEffect(() => {
    subscribe("gameBoard", id.current, refresh);
    return () => unsubscribe("gameBoard", id.current);
  });

  return [ gameBoard, player, turn ] as const;
}

export function useEnemyForfeit() {
  const [ _, update ] = useState(0);
  const refresh = () => update(x => x + 1);

  const id = useRef(Date.now().toString());

  useEffect(() => {
    subscribe("enemyForfeit", id.current, refresh);
    return () => unsubscribe("enemyForfeit", id.current);
  });

  return [ hasEnemyForfeited ] as const;
}