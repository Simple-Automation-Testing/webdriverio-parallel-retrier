const mochaJasminePatternSingleQuote = /(?<=it\(').+(?=')/ig;
const mochaJasminePatternDoubleQuote = /(?<=it\(").+(?=")/ig;
const mochaJasminePatternApostrophe = /(?<=it\(`).+(?=`)/ig;

export {
  mochaJasminePatternSingleQuote,
  mochaJasminePatternDoubleQuote,
  mochaJasminePatternApostrophe
}