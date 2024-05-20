import { joinQueue } from "../../api";
import styles from "./Menu.module.scss"
import icon from "/icon.png"
import { ImGithub } from "react-icons/im";


function Menu() {
  return ( 
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <p className={styles.main}>TIC TAC TOE</p>
        <p className={styles.sub}>MULTIPLAYER!</p>
      </div>
      <div className={styles.join}>
        <div className={styles.button} onClick={joinQueue}>JOIN GAME</div>
      </div>
      <div className={styles.logo}>
        <img src={icon} />
      </div>
      <div className={styles.credits}>
        Made by: <a href="https://github.com/DisekVojny/" target="_blank"><ImGithub /> Aleksander Hryckiewicz</a> & <a href="https://github.com/0x7030676e31/" target="_blank"><ImGithub /> Tobiasz Chemielewski</a> 2P
      </div>
    </div>
   );
}

export default Menu;