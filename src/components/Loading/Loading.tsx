import styles from "./Loading.module.scss"

function Loading() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.main}>Oczekiwanie na przeciwnika...</div>
            <div className={styles.loader}>
            </div>
        </div>
     );
}

export default Loading;