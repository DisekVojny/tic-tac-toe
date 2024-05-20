import { useGameState, GameState } from "./api";

import Loading from "./components/Loading/Loading";
import Game from './components/Game/game';
import Menu from "./components/Menu/Menu";

export default function App() {
  const [ gameState ] = useGameState();

  return (
    <>
      <div className="app">
        {gameState === GameState.MENU && <Menu/>}
        {gameState === GameState.QUEUE && <Loading/>}
        {gameState === GameState.PLAYING && <Game/>}
      </div>
      <div className="timeoutdz" />
    </>
  );
}
