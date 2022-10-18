import React, { Suspense } from "react";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { CCircle } from "react-bootstrap-icons";
import { Route, Routes } from "react-router-dom";
import styles from "./App.module.scss";
import ProgressBar from "react-bootstrap/ProgressBar";

const PuzzleWordle = React.lazy(() => import("./features/wordle/PuzzleWordle"));
const Puzzles = React.lazy(() => import("./features/puzzles/Puzzles"));

const App: React.FC = () => {
  const progressBar = (
    <div className={styles.ProgressBarContainer}>
      <ProgressBar animated now={100} label="Loading..." />
    </div>
  );
  return (
    <Provider store={store}>
      <div className={styles.App}>
        <div className={styles.AppBody}>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={progressBar}>
                  <Puzzles />
                </Suspense>
              }
            />
            <Route
              path="/wordle"
              element={
                <div className={styles.PuzzleWordle}>
                  <Suspense fallback={progressBar}>
                    <PuzzleWordle />
                  </Suspense>
                </div>
              }
            />
          </Routes>
        </div>
        <footer className={`${styles.AppFooter} text-muted`}>
          <CCircle />
          &nbsp;2010-2022 Eleventheye
        </footer>
      </div>
    </Provider>
  );
};

export default App;
