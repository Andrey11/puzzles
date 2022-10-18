import { processGuess } from './PuzzleWordle-helpers';
// import { IGuessModel } from './PuzzleDetails.types';

describe('PuzzleDetails-helpers tests', () => {
  

  describe('processGuess function', () => {
      test('expect processGuess to work', () => {
        // const guessApple: IGuessModel = { guessNumber: 1, guessWord: 'APPLE', guessWordDictionaryIndex: 1};
        // const guessGrain: IGuessModel = { guessNumber: 1, guessWord: 'GRAIN', guessWordDictionaryIndex: 1};
        // const guessGrade: IGuessModel = { guessNumber: 1, guessWord: 'GRADE', guessWordDictionaryIndex: 1};
        // const guessRenge: IGuessModel = { guessNumber: 1, guessWord: 'RENGE', guessWordDictionaryIndex: 1};
        // const guessShody: IGuessModel = { guessNumber: 1, guessWord: 'SHODY', guessWordDictionaryIndex: 1};
        // const guessNever: IGuessModel = { guessNumber: 1, guessWord: 'NEVER', guessWordDictionaryIndex: 1};
        // const guessEeeeg: IGuessModel = { guessNumber: 1, guessWord: 'EEEEG', guessWordDictionaryIndex: 1};
        expect(processGuess('APPLE', 'GREEN')).toEqual('00001');
        expect(processGuess('GRAIN', 'GREEN')).toEqual('22002');
        expect(processGuess('GRADE', 'GREEN')).toEqual('22001');
        expect(processGuess('RENGE', 'GREEN')).toEqual('11111');
        expect(processGuess('SHODY', 'GREEN')).toEqual('00000');
        expect(processGuess('NEVER', 'GREEN')).toEqual('11021');
        expect(processGuess('EEEEG', 'GREEN')).toEqual('00221');
        // expect(processGuess(guessApple, 'GREEN')).toEqual('00001');
        // expect(processGuess(guessGrain, 'GREEN')).toEqual('22002');
        // expect(processGuess(guessGrade, 'GREEN')).toEqual('22001');
        // expect(processGuess(guessRenge, 'GREEN')).toEqual('11111');
        // expect(processGuess(guessShody, 'GREEN')).toEqual('00000');
        // expect(processGuess(guessNever, 'GREEN')).toEqual('11021');
        // expect(processGuess(guessEeeeg, 'GREEN')).toEqual('00221');
        
        
      });
  });
});
