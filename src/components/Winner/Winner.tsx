import { motion, AnimatePresence } from "framer-motion";
import styles from "./Winner.module.scss"
import { goToMenu, joinQueue } from "../../api";


// 1 WIN
// 2 DEFEAT
// 3 DRAW

function Winner(props: {out: 1 | 2 | 3, shape: "x" | "o"}) {
  return ( <>
  
  <AnimatePresence>
    <motion.div
      key={"parent-box"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.winner}
    >

      <motion.div
          key={"child-box"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={styles.text}
      >
        <motion.h2
            initial={{ scale: 0, y: 100 }}
            animate={{
                scale: 1,
                y: 0,
                transition: {
                    y: { delay: 0.7 },
                    duration: 0.7,
                },
            }}
        >
            {props.out === 1 ? "WYGRANA!!":""}
            {props.out === 2 ? "PRZEGRANA D:":""}
            {props.out === 3 ? "REMIS":""}

        </motion.h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{
              scale: 1,
              transition: {
                  delay: 1.3,
                  duration: 0.2,
              },
          }}
          className={styles.win}
        >
            
            <div className={styles.square}>
              <span className={props.shape === "x" ? styles.x : styles.o}></span>
            </div>



        </motion.div>
        <motion.div
            initial={{ scale: 0 }}
            animate={{
                scale: 1,
                transition: { delay: 1.5, duration: 0.3 },
            }}
        >
            <div className="buttons">
              <div className={styles.button} onClick={joinQueue}>NEW GAME</div>
              <div className={styles.button} onClick={goToMenu}>MENU</div>
            </div>
        </motion.div>
      </motion.div>
    </motion.div>
  </AnimatePresence>

  </> );
}

export default Winner;