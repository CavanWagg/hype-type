export default function waves(waveNum) {
  const waveArray = [];
  const wordCount = waveNum + 2;

  for (let i = 0; i < wordCount; i++) {
    const typeWord = { type: 'just-a-word' };
    waveArray.push(typeWord);
  }
  return waveArray;
}
