const fs = require("fs");

const bookFile = "Antoine_de_Saint-exupéry_o_Pequeno_Príncipe.txt";
const stopWordsFile = "stopwordsPt.txt";

const readFile = (fileName) => {
  try {
    const fileContent = fs.readFileSync(fileName, "utf-8");
    // return fileContent.match(/[a-zA-Zà-úÀ-Ú-]{4,}/g) || [].map((word) => word.toLowerCase());
    if(fileName === "stopwordsPt.txt") {
      return fileContent.split(", ");
    }
    // return fileContent.match(/[a-zA-Zà-úÀ-Ú-]{4,}/g).map(word => word.toLowerCase());
    return fileContent;
  } catch(err) {
    console.error(`Erro ao ler o arquivo: ${err}`);
  }
}

const bookFileContent = readFile(bookFile);
const phrases = bookFileContent.split(/(?<=[.!?…—])\s+/).map(frase => frase.replace(/[.,;:!?"'…—]/g, '').trim());

const stopWordsFileContent = readFile(stopWordsFile)

const phrasesWithoutStopWords = phrases.map(phrase => {
  const words = phrase.split(/\s+/);
  const wordsWithoutStopWords = words.filter(word => !stopWordsFileContent.includes(word.toLowerCase()));
  return wordsWithoutStopWords.join(' ');
});

// const filtered = phrases.filter(word => !stopWordsFileContent.includes(word))
function amountOfWords(phrases) {
  return phrases.reduce((amountOfWords, phrase) => {
    const words = phrase.split(" ");
    
    return amountOfWords + words.length;
  }, 0);
}

function substituirAcentosECedilha(frases) {
  const mapaAcentosCedilha = {
    'á': 'a', 'à': 'a', 'ã': 'a', 'â': 'a', 'é': 'e', 'ê': 'e', 'í': 'i', 'ó': 'o', 'õ': 'o', 'ô': 'o',
    'ú': 'u', 'ü': 'u', 'ç': 'c'
  };

  const frasesSubstituidas = frases.map(frase => {
    return frase.replace(/[áàãâéêíóõôúüç]/gi, match => mapaAcentosCedilha[match.toLowerCase()] || 'c');
  });

  return frasesSubstituidas;
}

function phrasesToNetwork(phrasesWithoutStopWords) {
  return phrasesWithoutStopWords.reduce((network, phrase) => {
    const words = phrase.split(" ");

    const edges = words.reduce((result, currentWord, index) => {
      const nextWords = words.slice(index + 1);

      const edge = nextWords.map(nextWord => `${currentWord} ${nextWord}`);
      return result.concat(edge);
    }, []);

    return network.concat(edges);
  }, []);
}

const newPhrases = substituirAcentosECedilha(phrasesWithoutStopWords);
console.log(newPhrases)
const result = phrasesToNetwork(newPhrases);
const numberWords = amountOfWords(phrasesWithoutStopWords);

// const dl = `DL n=${numberWords}\nformat = edgelist1\nlabels embedded:\ndata:\n${result
//   .map(({ word, character }) => `${character} ${word}`)
//   .join("\n")}`;

const dl = `DL n=${numberWords}\nformat = edgelist1\nlabels embedded:\ndata:\n` + result.join('\n');

const networkFile = "./network.dl";
fs.writeFileSync(networkFile, dl);


// console.log(phrasesWithoutStopWords)
// console.log(filtered);


