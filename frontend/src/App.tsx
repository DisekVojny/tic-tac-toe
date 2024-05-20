import { Match, Switch } from "solid-js";
import { GameState, gameState } from "./api";

import Home from "./components/home";
import Queue from "./components/queue";
import Game from "./components/game";

export default function App() {
  return (
    <Switch>
      <Match when={gameState() === GameState.MENU}>
        <Home />
      </Match>
      <Match when={gameState() === GameState.QUEUE}>
        <Queue />
      </Match>
      <Match when={gameState() === GameState.PLAYING}>
        <Game />
      </Match>
    </Switch>
  );
}