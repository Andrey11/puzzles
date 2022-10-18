import {
  LOG_CLS_FAILURE as LOG_FAILURE,
  LOG_CLS_SUCCESS as LOG_SUCCESS,
  LOG_CLS_WOD as LOG_WOD,
} from "../../PuzzleWordle-helpers";
import {
  IWordDefinition,
  IWordsDefinitions,
  WordDefinitionCallback,
} from "../../PuzzleWordle.types";

const hasCachedWordDefinition = (wordAsKey: string): boolean =>
  localStorage.getItem(wordAsKey) !== null;

const getCachedWordDefinition = (word: string): IWordDefinition => {
  const stringData = localStorage.getItem(word) || "";
  try {
    const jsonData = JSON.parse(stringData);
    const def = jsonData as unknown as IWordsDefinitions;
    return def[0] as IWordDefinition;
  } catch (error) {
    return {
      word: "",
      license: { name: "", url: "" },
      meanings: [],
      phonetic: "",
      phonetics: [],
      sourceUrls: [],
      isError: false,
    };
  }
};

const getWordDefinition = (word: string, callback: WordDefinitionCallback) => {
  if (hasCachedWordDefinition(word)) {
    console.log(
      `Definition for %c${word}%c exists in local storage`,
      LOG_WOD,
      LOG_SUCCESS
    );
    return callback(getCachedWordDefinition(word));
  }
  console.log(
    `Definition for %c${word}%c is not in local storage`,
    LOG_WOD,
    LOG_FAILURE
  );
  return fetchWordDefinition(word, callback);
};

const fetchWordDefinition = (
  word: string,
  callback: WordDefinitionCallback
) => {
  const openDictionaryApiUrl =
    "https://api.dictionaryapi.dev/api/v2/entries/en/";
  if (word) {
    fetch(`${openDictionaryApiUrl}${word}`, { method: "GET" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw Error(`Definition for word %c${word}%c cannot be found`);
      })
      .then((actualData) => {
        const wordDefinitions = actualData as IWordsDefinitions;

        // definition?.phonetics
        const wordDef = wordDefinitions[0] as IWordDefinition;
        localStorage.setItem(
          wordDef.word.toUpperCase(),
          JSON.stringify(actualData)
        );
        console.log(wordDefinitions[0].word);
        callback(wordDef);
      })
      .catch((err) => {
        console.log(err.message, LOG_WOD, LOG_FAILURE);
        callback({
          word,
          license: { name: "", url: "" },
          meanings: [],
          phonetic: "",
          phonetics: [],
          sourceUrls: [],
          isError: true,
        });
      });
  }
};

export { getWordDefinition };
