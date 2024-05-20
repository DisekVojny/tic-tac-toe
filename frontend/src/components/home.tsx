import { Accessor } from "solid-js";
import { joinQueue } from "../api";
import styles from "./home.module.scss";


export default function Home() {
  return (
    <>
      Join Queue:
      <button onClick={() => joinQueue()}>Join</button>
    </>
  );
}