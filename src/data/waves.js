export default function waves(waveNum) {
  var waveArray = [];
  var wordCount = waveNum + 2;

  for (var i = 0; i < wordCount; i++) {
    var typeWord = { type: 'just-a-word' };
    waveArray.push(typeWord);
  }
  return waveArray;
}
