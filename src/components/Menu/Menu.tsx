import styles from "./Menu.module.scss"
import icon from "/icon.png"

function Menu() {
  return ( 
    <div className={styles.wrapper}>
      <div className={styles.title}>TIC TAC TOE</div>
      <div className={styles.join}>
        <div className={styles.button}>JOIN GAME</div>
      </div>
      <div className={styles.logo}>
        <img src={icon} />
      </div>
      <div className={styles.credits}>
        Made by: <a href="https://github.com/DisekVojny/" target="_blank">Aleksander Hryckiewicz</a> & <a href="https://github.com/0x7030676e31/" target="_blank">Tobiasz Chemielewski</a> 2P
      </div>
    </div>
   );
}

export default Menu;