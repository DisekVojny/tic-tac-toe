import { makeMove, useGameBoard } from "../../api";
import styles from "./game.module.scss";

export default function Game() {
  const [ gameBoard, player, turn ] = useGameBoard();

  return (
    <div className={`${styles.game} ${turn ? styles.xturn : ""}`}>
      <h1 className={styles.header}>Grasz jako: <span className={`${styles.player} ${player ? styles.player1 : styles.player2}`}>{player ? "Krzyżyk" : "Kółko"}</span></h1>
      <p className={styles.subheader}>{turn ? "Twój ruch" : "Ruch przeciwnika"}</p>
      <div className={styles.board}>
        {gameBoard.map((value, index) => <div
            className={`${styles.square} ${value !== 0 ? styles.square_taken : ""}`}
            onClick={() => turn && makeMove(index)}
            key={index}
          >
            {value !== 0 && (<span className={`${styles.span} ${value === 1 ? styles.x : styles.o}`} />)}
          </div>
        )}
      </div>
      <div className={styles.turn}>
        <div>
          <span className={`${styles.span} ${styles.x} ${player === turn ? styles.target : ""}`} style={{ zIndex: 5 }} />
        </div>
        <div>
          <span className={`${styles.span} ${styles.o} ${player !== turn ? styles.target : ""}`} style={{ zIndex: 5 }} />
        </div>
        <div className={`${styles.turnIndicator} ${player !== turn && styles.turn_o}`} />
      </div>
    </div>
  )
}

// (player === true && turn) || (player !== true && !turn)
