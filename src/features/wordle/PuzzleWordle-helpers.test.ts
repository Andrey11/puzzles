import { binarySearch, findIndexOf, isWordInDictionary, processGuess } from './PuzzleWordle-helpers';
import { allAvailableWords as allWords } from './PuzzleWords';
// import { IGuessModel } from './PuzzleDetails.types';

describe('PuzzleDetails-helpers tests', () => {
  

  describe('processGuess function', () => {
      test('expect processGuess to work', () => {
        expect(processGuess('APPLE', 'GREEN')).toEqual('00001');
        expect(processGuess('GRAIN', 'GREEN')).toEqual('22002');
        expect(processGuess('GRADE', 'GREEN')).toEqual('22001');
        expect(processGuess('RENGE', 'GREEN')).toEqual('11111');
        expect(processGuess('SHODY', 'GREEN')).toEqual('00000');
        expect(processGuess('NEVER', 'GREEN')).toEqual('11021');
        expect(processGuess('EEEEG', 'GREEN')).toEqual('00221');
      });
  });

  describe('binary search functionality', () => {
    const inputSortedList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
    test('expect binarySearch to return correct indicies', () => {
      expect(binarySearch(0, inputSortedList.length, 'A', inputSortedList)).toEqual(0);
      expect(binarySearch(0, inputSortedList.length, 'G', inputSortedList)).toEqual(6);
      expect(binarySearch(0, inputSortedList.length, 'Z', inputSortedList)).toEqual(-1);

      expect(binarySearch(0, inputSortedList.length, 'B', inputSortedList)).toEqual(1);
      expect(binarySearch(0, inputSortedList.length, 'C', inputSortedList)).toEqual(2);
      expect(binarySearch(0, inputSortedList.length, 'D', inputSortedList)).toEqual(3);
      expect(binarySearch(0, inputSortedList.length, 'E', inputSortedList)).toEqual(4);
      expect(binarySearch(0, inputSortedList.length, 'F', inputSortedList)).toEqual(5);
    });
    
    test('expect findIndexOf to return correct indicies', () => {
      expect(findIndexOf('A', inputSortedList)).toEqual(0);
      expect(findIndexOf('G', inputSortedList)).toEqual(6);
      expect(findIndexOf('Z', inputSortedList)).toEqual(-1);

      expect(findIndexOf('B', inputSortedList)).toEqual(1);
      expect(findIndexOf('C', inputSortedList)).toEqual(2);
      expect(findIndexOf('D', inputSortedList)).toEqual(3);
      expect(findIndexOf('E', inputSortedList)).toEqual(4);
      expect(findIndexOf('F', inputSortedList)).toEqual(5);
    });

    test('expect isInDictionary to return false', () => {
      expect(isWordInDictionary('')).toBe(false);
      expect(isWordInDictionary('A')).toBe(false);
      expect(isWordInDictionary('AA')).toBe(false);
      expect(isWordInDictionary('AAA')).toBe(false);
      expect(isWordInDictionary('AAAA')).toBe(false);
      expect(isWordInDictionary('AAAAA')).toBe(false);
      expect(isWordInDictionary('AAAAAA')).toBe(false);
      expect(isWordInDictionary('GUESSING')).toBe(false);
    });

    test('expect all words in allAvailableWords to be in dictionary', () => {
      const isTrue = allWords.every((word: string) => isWordInDictionary(word));
      expect(isTrue).toBe(true);
    });
  });
});
