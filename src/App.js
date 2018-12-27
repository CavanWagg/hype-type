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
      fallingWords: [],
      isPlaying: false,
      totalKeystrokes: 0,
      totalMistakes: 0,
      waveCount: 0,
      letters: 'abcdefghijklmnopqrstuvwxyz',
      currentEnemyIndex: null,
      currentEnemy: null
    };
    this.queueNextWave = this.queueNextWave.bind(this);
    this.findWord = this.findWord.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.reduceLetters = this.reduceLetters.bind(this);
    this.TypeSwitch = new TypeSwitch({ stubbornMode: true });
    this.TypeSwitch.on('incorrect', () => {
      // this.state.totalKeystrokes++;
      // this.state.totalMistakes++;
      this.setState(state => ({
        stats: {
          longestStreak: state.stats.longestStreak,
          accuracy: (1 - state.totalMistakes / state.totalKeystrokes) * 100,
          score: state.stats.score > 0 ? state.stats.score - 25 : 0,
          currentStreak: 0
        }
      }));
    });
    this.TypeSwitch.on('correct', () => {
      // this.state.totalKeystrokes++;
      this.setState(state => ({
        stats: {
          score: state.stats.score,
          accuracy: (1 - state.totalMistakes / state.totalKeystrokes) * 100,
          currentStreak: state.stats.currentStreak + 1,
          longestStreak: state.stats.currentStreak > state.stats.longestStreak ? (
            state.stats.currentStreak
          ) : (
            state.stats.longestStreak
          )
        }
      }));
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

  queueNextWave(firstRound = false) {
    if (firstRound) {
      this.TypeSwitch.broadcast('gamestart');
      this.setState({
        stats: {
          score: 0,
          currentStreak: 0,
          longestStreak: 0,
          accuracy: 100
        },
        isPlaying: true
      });
    }
    setTimeout(() => {
      this.setState(state => ({
        fallingWords: [],
        waveLaunching: true,
        waveCount: state.waveCount + 1
      }));
      this.launchWave();
    }, 1000);
  }

  launchWave() {
    document.addEventListener('keypress', this.findWord, false);
    const waveData = waves(this.state.waveCount);
    const newWave = waveData.map((enemy, index) => {
      const typeWord = {};
      typeWord.componentIdentifier = '[data-enemy="' + index + '"]';
      typeWord.wordIdentifier = '[data-word="' + index + '"]';
      typeWord.containerIdentifier = '[data-container="' + index + '"]';
      typeWord.isDead = false;
      const wordString = this.reduceLetters(wordBank.word);
      // the word is a string
      typeWord.word = wordString;
      typeWord.letterArray = helpers.createWord(typeWord.word);
      typeWord.component = (
        <Word
          key={this.state.waveCount.toString() + index}
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
    const availableCharacter = this.state.letters[
      Math.floor(Math.random() * this.state.letters.length)
    ];
    // returns an array of all the words in the wordbank that start with the availableCharacter.
    var availableWordArray = wordBank.filter(word => {
      return word.charAt(0) === availableCharacter;
    });
    // returns a random word(string) that is from the availableWordArray.
    var newWord = availableWordArray[Math.floor(Math.random() * availableWordArray.length)];
    this.setState(state => ({
      letters: state.letters.replace(newWord.charAt(0), '')
    }));
    return newWord;
  }

  findWord(e) {
    const pressedCharCode = typeof e.which === 'number' ? e.which : e.keycode;
    const pressedKeyChar = String.fromCharCode(pressedCharCode);
    this.state.fallingWords.forEach((target, index) => {
      if (target.word.charAt(0) === pressedKeyChar) {
        this.setState({
          currentEnemyIndex: index,
          currentEnemy: target
        });
        this.TypeSwitch.changeCurrentIndex(1);
        this.TypeSwitch.start(target.word);
        this.TypeSwitch.broadcast('targetAcquired');
        helpers.changeLetterColor(target.wordIdentifier, 1);
        document.removeEventListener('keypress', this.findWord);
      }
    });
  }

  removeWord() {
    this.setState(state => ({
      letters: state.letters + this.currentEnemy.word.charAt(0)
    }));
    helpers.changeLetterColor(
      this.currentEnemy.wordIdentifier,
      this.TypeSwitch.getGameStats().currentIndex
    );

    const adjustedWordArray = this.state.fallingWords;
    const adjustedWord = adjustedWordArray[this.state.currentEnemyIndex];
    adjustedWord.isDead = true;
    this.setState(state => ({
      stats: {
        score: state.stats.score + 200,
        accuracy: state.stats.accuracy,
        currentStreak: state.stats.currentStreak,
        longestStreak: state.stats.longestStreak
      },
      fallingWords: adjustedWordArray,
      currentEnemy: null,
      currentEnemyIndex: null
    }));
    this.TypeSwitch.resetGame();
  }

  handleClick() {
    this.queueNextWave(true);
  }

  render() {
    const allTheWords = this.state.fallingWords.map(word => {
      return word.component;
    });
    return (
      <AppWrapper className="wrapper">
        <AppHeader> Hype Type</AppHeader>
        <AppSidebar>
          {' '}
          Score {this.state.stats.score}
          {this.state.isPlaying ? (
            null
          ) : (
            <button onClick={this.handleClick}>
              Start
            </button>
          )}
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
