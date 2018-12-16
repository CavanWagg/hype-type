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
  .word{
    display: flex;
  }
  .letter {
    color: black;
    font-weight: bold;
    background: aqua;
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
      stats: {
        score: 0,
        currentStreak: 0,
        longestStreak: 0,
        accuracy: 100
      },
      fallingWords: []
    };
    this.letters = 'abcdefghijklmnopqrstuvwxyz';
    this.currentEnemyIndex = null;
    this.currentEnemy = null;
    this.waveCount = 0;
    this.queueNextWave = this.queueNextWave.bind(this);
    this.findWord = this.findWord.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.reduceLetters = this.reduceLetters.bind(this);
    this.TypeSwitch = new TypeSwitch({ stubbornMode: true });
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

      this.TypeSwitch.broadcast('targetAcquired');
      helpers.changeLetterColor(
        this.currentEnemy.wordIdentifier,
        this.TypeSwitch.getGameStats().currentIndex
      );
    });
    this.TypeSwitch.on('complete', () => {
      this.removeWord();
      var remainingEnemies = this.state.fallingWords.filter(enemy => {
        return !enemy.isDead;
      });
      if (remainingEnemies.length === 0) {
        this.queueNextWave();
      } else {
        setTimeout(() => {
          document.addEventListener('keypress', this.findWord, false);
        });
      }
    });
  }

  queueNextWave() {
    if (!this.waveCount) {
      this.TypeSwitch.broadcast('gamestart');
      this.setState({
        stats: {
          score: 0,
          currentStreak: 0,
          longestStreak: 0,
          accuracy: 100
        }
      });
    }
    this.waveCount++;
    setTimeout(() => {
      this.setState({
        fallingWords: [],
        waveLaunching: true
      });
      this.launchWave();
    }, 1000);
  }

  launchWave() {
    document.addEventListener('keypress', this.findWord, false);
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
      typeWord.letterArray = helpers.createWord(typeWord.word);
      typeWord.component = (
        <Word
          key={this.waveCount.toString() + index}
          enemyIndex={index}
          letterArray={typeWord.letterArray}
          reduceLetters={this.reduceLetters}
          containerIdentifier={typeWord.containerIdentifier}
        />
      );
      return typeWord;
    });
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

  findWord(e) {
    var pressedCharCode = typeof e.which === 'number' ? e.which : e.keycode;
    var pressedKeyChar = String.fromCharCode(pressedCharCode);
    var wordFound = false;
    this.state.fallingWords.forEach((target, index) => {
      if (target.word.charAt(0) === pressedKeyChar) {
        wordFound = true;
        this.currentEnemyIndex = index;
        this.currentEnemy = target;
        this.TypeSwitch.changeCurrentIndex(1);
        this.TypeSwitch.start(target.word);
        this.TypeSwitch.broadcast('targetAcquired');
        helpers.changeLetterColor(this.currentEnemy.wordIdentifier, 1);
        document.removeEventListener('keypress', this.findWord);
      }
    });
  }

  updateStats(key, value) {
    var adjustedStats = this.state.stats;
    adjustedStats[key] = value;
    this.setState({
      stats: adjustedStats
    });
  }

  removeWord() {
    this.letters = this.letters + this.currentEnemy.word.charAt(0);
    helpers.changeLetterColor(
      this.currentEnemy.wordIdentifier,
      this.TypeSwitch.getGameStats().currentIndex
    );

    var adjustedWordArray = this.state.fallingWords;
    var adjustedWord = adjustedWordArray[this.currentEnemyIndex];
    adjustedWord.isDead = true;
    this.updateStats('score', this.state.stats.score + 200);
    this.setState({
      fallingWords: adjustedWordArray
    });

    this.currentEnemy = null;
    this.currentEnemyIndex = null;
    this.TypeSwitch.resetGame();
  }

  handleClick() {
    var button = document.getElementById('start');
    button.addEventListener('click', hideshow, false);
    function hideshow() {
      this.style.display = 'none';
    }
    this.queueNextWave();
  }

  render() {
    var allTheWords = this.state.fallingWords.map(word => {
      return word.component;
    });
    return (
      <AppWrapper className="wrapper">
        <AppHeader> Hype Type</AppHeader>
        <AppSidebar>
          {' '}
          Score {this.state.score}
          <button id="start" onClick={this.handleClick}>
            Start
          </button>
        </AppSidebar>
        <AppContent>
          Game Content
          <div className="word-space">{allTheWords}</div>
        </AppContent>
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

export default App;
