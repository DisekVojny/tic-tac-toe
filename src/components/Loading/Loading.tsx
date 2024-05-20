import { leaveQueue } from "../../api";
import { FaAngleRight } from "react-icons/fa6";

import styles from "./Loading.module.scss"

function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>Oczekiwanie na przeciwnika...</div>
      <div className={styles.loader} />
      <p className={styles.cancel} onClick={() => leaveQueue()}>Wróć do strony głównej <FaAngleRight /></p>
    </div>
  );
}

export default Loading;