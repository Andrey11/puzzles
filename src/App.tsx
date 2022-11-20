import React, { Suspense } from 'react';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { CCircle } from 'react-bootstrap-icons';
import { Route, Routes } from 'react-router-dom';

import styles from './App.module.scss';
import {
  PuzzlesLoader,
  WordleSolverLoader,
  WordleVersusLoader,
} from './components/puzzleloader/PuzzleLoader';
import PuzzleHeader from './components/header/PuzzleHeader';

const PuzzleWordleVersus = React.lazy(
  () => import('./features/wordle/wordleversus/PuzzleWordleVersus')
);
const PuzzleWordleSolver = React.lazy(
  () => import('./features/wordle/wordlesolver/PuzzleWordleSolver')
);
const Puzzles = React.lazy(() => import('./features/puzzles/Puzzles'));

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={styles.App}>
        <PuzzleHeader />
        <div className={styles.AppBody}>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<PuzzlesLoader />}>
                  <Puzzles />
                </Suspense>
              }
            />
            <Route
              key="wordle"
              path="/wordle"
              errorElement={<div className={styles.PuzzleWordle}>HELLO</div>}
            >
              <Route
                key="wordle-solver"
                path="/wordle/solver"
                element={
                  <div className={styles.PuzzleWordle}>
                    <Suspense fallback={<WordleSolverLoader />}>
                      <PuzzleWordleSolver />
                    </Suspense>
                  </div>
                }
              />
              <Route
                key="wordle-versus"
                path="/wordle/versus"
                element={
                  <div className={styles.PuzzleWordle}>
                    <Suspense fallback={<WordleVersusLoader />}>
                      <PuzzleWordleVersus />
                    </Suspense>
                  </div>
                }
              />
            </Route>
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
