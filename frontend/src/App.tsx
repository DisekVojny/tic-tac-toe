import { Match, Switch } from "solid-js";
import { useGameState, GameState } from "./api";

import Home from "./components/home";
import Queue from "./components/queue";
import Game from "./components/game";

export default function App() {
  const { transition, gameState, setGameState } = useGameState();
  
  return (
    <Switch>
      <Match when={gameState() === GameState.MENU}>
        <Home transition={transition} />
      </Match>
      <Match when={gameState() === GameState.QUEUE}>
        <Queue transition={transition} />
      </Match>
      <Match when={gameState() === GameState.PLAYING}>
        <Game transition={transition} />
      </Match>
    </Switch>
  );
}