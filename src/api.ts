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
  = { type: "GameStart", payload: boolean } // True if player is X; false if player is O
  | { type: "OpponentMove", payload: number }
  | { type: "OpponentForfeit" };

let socket: WebSocket | null = null;
let gameState: GameState = GameState.MENU;
let gameBoard: number[] = Array(9).fill(0);
let player: boolean | null = null; // True for X, false for O
let round: boolean | null = null; // True for player's turn, false for opponent's turn

export async function joinQueue() {
  socket = new WebSocket(`${API}/queue`);
  gameState = GameState.QUEUE;
  notify("gameState");

  socket.onmessage = event => {}
}

export async function leaveQueue() {}

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
