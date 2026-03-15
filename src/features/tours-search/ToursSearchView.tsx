import { FC } from "react";
import { SearchSection } from "./components";
import styles from "./ToursSearchView.module.css";

const ToursSearchView: FC = () => (
  <div className={styles.wrapper}>
    <SearchSection />
  </div>
);

export default ToursSearchView;
