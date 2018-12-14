import React, { Component } from 'react';
import styled from 'styled-components';
import helpers from './utils/helpers';
import { createGlobalStyle } from 'styled-components';
import TypeSwitch from 'type-switch';
import wordBank from './data/wordBank';
import Word from './components/Word';
import waves from './data/waves';

//* Styles

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
  box-sizing: border-box;
  }
  body {
    margin: 40px;
    font-family: 'Open Sans', 'sans-serif';
    background-color: #fff;
  }
  h1,
  p {
  margin: 0 0 1em 0;
  }
  @supports (display: grid) {
    .wrapper > * {
    width: auto;
    margin: 0;
    }
  }
  .wrapper > * {
    background-color: #191970;
    color: #fff;
    border-radius: 5px;
    padding: 20px;
    font-size: 150%;
    /* needed for the floated layout*/
    margin-bottom: 10px;
  }
  `;

const AppWrapper = styled.div`
  @media screen and (min-width: 500px) {
    margin: 0 auto;
    grid-template-columns: 1fr 5fr;
  }
  max-width: 1200px;
  margin: 0 20px;
  display: grid;
  grid-gap: 10px;
`;

const AppHeader = styled.header`
  @media screen and (min-width: 500px) {
    grid-column: 1 / -1;
    /* needed for the floated layout */
    clear: both;
  }
`;

const AppContent = styled.article`
  @media screen and (min-width: 500px) {
    float: right;
    /* width: 79.7872%; */
    min-height: 500px;
  }
`;

const AppSidebar = styled.aside`
  @media screen and (min-width: 500px) {
    float: left;
    /* width: 19.1489%; */
  }
`;
//* -------------------------------------------------------------------------

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      isPlaying: false,
      fallingWords: []
    };
    this.waveCount = 0;
    this.init = this.init.bind(this);
    // this.reduceLetters = this.reduceLetters.bind(this);
    this.TypeSwitch = new TypeSwitch({ stubbornMode: true });
    this.letters = 'abcdefghijklmnopqrstuvwxyz';
    this.TypeSwitch.on('incorrect', () => {
      this.totalKeystrokes++;
      this.totalMistakes++;
      this.updateStats(
        'accuracy',
        (1 - this.totalMistakes / this.totalKeystrokes) * 100
      );
      this.updateStats(
        'score',
        this.state.stats.score > 0 ? this.state.stats.score - 25 : 0
      );
      this.updateStats('currentStreak', 0);
      alert('wrong key');
    });
    this.TypeSwitch.on('correct', () => {
      this.totalKeystrokes++;
      this.updateStats(
        'accuracy',
        (1 - this.totalMistakes / this.totalKeystrokes) * 100
      );
      this.updateStats('currentStreak', this.state.stats.currentStreak + 1);
      this.updateStats(
        'longestStreak',
        this.state.stats.currentStreak > this.state.stats.longestStreak
          ? this.state.stats.currentStreak
          : this.state.stats.longestStreak
      );
      this.changeLetterColor(
        'letter',
        this.TypeSwitch.getGameStats().currentIndex
      );
    });
    this.TypeSwitch.on('complete', () => {
      setTimeout(() => {
        document.addEventListener('keypress', this.findWord, false);
      });
    });
  }

  init() {
    this.setState({ isPlaying: true });
    var waveData = waves(this.waveCount);
    var newWave = waveData.map((enemy, index) => {
      var typeWord = {};
      typeWord.componentIdentifier = '[data-enemy="' + index + '"]';
      typeWord.wordIdentifier = '[data-word="' + index + '"]';
      typeWord.containerIdentifier = '[data-container="' + index + '"]';
      typeWord.isDead = false;
      var wordString = this.reduceLetters(wordBank.word);
      // the word is a string
      typeWord.word = wordString;
      // letter array of word
      typeWord.letterArray = helpers.createWord(typeWord.word);
      typeWord.component = (
        <Word
          key={this.waveCount.toString() + index}
          enemyIndex={index}
          letterArray={typeWord.letterArray}
          reduceLetters={this.reduceLetters}
        />
      );
      return typeWord;
    });
    console.log(this.waveCount);
    this.setState({ fallingWords: newWave });
  }

  reduceLetters(wordBank) {
    // random letter
    var availableCharacter = this.letters[
      Math.floor(Math.random() * this.letters.length)
    ];
    // returns an array of all the words in the wordbank that start with the availableCharacter.
    var availableWordArray = wordBank.filter(word => {
      return word.charAt(0) === availableCharacter ? true : false;
    });
    // returns a random word(string) that is from the availableWordArray.
    var newWord =
      availableWordArray[Math.floor(Math.random() * availableWordArray.length)];
    this.letters = this.letters.replace(newWord.charAt(0), '');
    return newWord;
  }

  render() {
    var allTheWords = this.state.fallingWords.map(word => {
      return word.component;
    });
    console.log(allTheWords);
    return (
      <AppWrapper className="wrapper">
        <AppHeader> Hype Type</AppHeader>
        <AppSidebar>
          {' '}
          Score {this.state.score}
          <button onClick={this.init}>Start</button>
        </AppSidebar>
        <AppContent>
          Game Content
          {allTheWords}
        </AppContent>
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

export default App;
