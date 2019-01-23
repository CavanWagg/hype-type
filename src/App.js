import React, { Component } from 'react';
import styled from 'styled-components';
import helpers from './utils/helpers';
import { globalStyle, createGlobalStyle } from '@smooth-ui/core-sc';
import TypeSwitch from 'type-switch';
import wordBank from './data/wordBank';
import Word from './components/Word';
import waves from './data/waves';
import Message from './components/Message';
import { ThemeProvider } from '@smooth-ui/core-sc';
import { Box } from '@smooth-ui/core-sc';
import theme from './theme';

//* Styles

const GlobalStyle = createGlobalStyle`${globalStyle()};


  .wordContainer {
    justify-self: center;
    position: relative;
  }
  .word {
    display: flex;
  }
  .letter {
    font-weight: bold;
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
  #word-space {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 30px 30px 30px;
  }
  #messageContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .message-div {
    text-align: center;
  }
   .fade-exiting {
    animation: fade-exiting-animation .6s cubic-bezier(.55,-0.04,.91,.94) forwards;
}
 
@keyframes fade-exiting-animation {
    from {
         opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0);
    }
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
      waveLaunching: false,
      totalKeystrokes: 0,
      totalMistakes: 0,
      waveCount: 0
    };
    this.letters = 'abcdefghijklmnopqrstuvwxyz';
    this.currentEnemyIndex = null;
    this.currentEnemy = null;
    this.messageType = 'startGame';
    this.TypeSwitch = new TypeSwitch({ stubbornMode: true });
    this.TypeSwitch.on('incorrect', () => {
      this.setState(state => ({
        stats: {
          longestStreak: state.stats.longestStreak,
          accuracy: (1 - state.totalMistakes / state.totalKeystrokes) * 100,
          score: state.stats.score > 0 ? state.stats.score - 25 : 0,
          currentStreak: 0
        },
        totalKeystrokes: state.totalKeystrokes + 1,
        totalMistakes: state.totalMistakes + 1
      }));
    });
    this.TypeSwitch.on('correct', () => {
      this.setState(state => ({
        stats: {
          score: state.stats.score,
          accuracy: (1 - state.totalMistakes / state.totalKeystrokes) * 100,
          currentStreak: state.stats.currentStreak + 1,
          longestStreak:
            state.stats.currentStreak > state.stats.longestStreak
              ? state.stats.currentStreak
              : state.stats.longestStreak
        },
        totalKeystrokes: state.totalKeystrokes + 1
      }));
      this.TypeSwitch.broadcast('targetAcquired');
      helpers.changeLetterColor(
        this.currentEnemy.wordIdentifier,
        this.TypeSwitch.getGameStats().currentIndex
      );
    });
    this.TypeSwitch.on('complete', () => {
      this.textToSpeech();
      this.removeWord();
      let remainingEnemies = this.state.fallingWords.filter(enemy => {
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

  queueNextWave = (firstRound = false) => {
    if (firstRound) {
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
    this.messageType = 'playingGame';
    setTimeout(() => {
      this.setState(state => ({
        fallingWords: [],
        waveLaunching: true,
        waveCount: state.waveCount < 10 ? state.waveCount + 1 : 1
      }));
      this.launchWave();
    }, 1000);
  };

  launchWave = () => {
    this.setState({ waveLaunching: true });
    document.addEventListener('keypress', this.findWord, false);
    this.TypeSwitch.start('');
    this.TypeSwitch.pauseGame();
    this.populateWave();
  };

  populateWave = () => {
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
      typeWord.Component = (
        <Word
          key={this.state.waveCount.toString() + index}
          id={this.state.waveCount.toString() + index}
          row={index < 4 ? 1 : index < 8 ? 2 : 3}
          isDead={typeWord.isDead}
          enemyIndex={index}
          letterArray={typeWord.letterArray}
          reduceLetters={this.reduceLetters}
          gameOver={this.gameOver}
          containerIdentifier={typeWord.containerIdentifier}
        />
      );
      return typeWord;
    });
    this.setState({
      fallingWords: newWave
    });
  };

  reduceLetters = wordBank => {
    // random letter
    const availableCharacter = this.letters[
      Math.floor(Math.random() * this.letters.length)
    ];
    // returns an array of all the words in the wordbank that start with the availableCharacter.
    var availableWordArray = wordBank.filter(word => {
      return word.charAt(0) === availableCharacter;
    });
    // returns a random word(string) that is from the availableWordArray.
    var newWord =
      availableWordArray[Math.floor(Math.random() * availableWordArray.length)];
    this.letters = this.letters.replace(newWord.charAt(0), '');
    return newWord;
  };

  findWord = e => {
    const pressedCharCode = typeof e.which === 'number' ? e.which : e.keycode;
    const pressedKeyChar = String.fromCharCode(pressedCharCode);
    this.state.fallingWords.forEach((target, index) => {
      if (target.word.charAt(0) === pressedKeyChar && !target.isDead) {
        this.currentEnemyIndex = index;
        this.currentEnemy = target;
        this.TypeSwitch.changeCurrentIndex(1);
        this.TypeSwitch.start(target.word);
        this.TypeSwitch.broadcast('targetAcquired');
        helpers.changeLetterColor(this.currentEnemy.wordIdentifier, 1);
        document.removeEventListener('keypress', this.findWord);
      }
    });
  };
  textToSpeech = () => {
    this.speaker = new SpeechSynthesisUtterance();
    this.speaker.lang = 'en-US';
    this.speaker.text = this.currentEnemy.word;
    speechSynthesis.speak(this.speaker);
  };
  removeWord = () => {
    this.letters = this.letters + this.currentEnemy.word.charAt(0);
    helpers.changeLetterColor(
      this.currentEnemy.wordIdentifier,
      this.TypeSwitch.getGameStats().currentIndex
    );

    let adjustedWordArray = this.state.fallingWords;
    let adjustedWord = adjustedWordArray[this.currentEnemyIndex];
    adjustedWord.isDead = true;

    this.setState(state => ({
      stats: {
        score: state.stats.score + 200,
        accuracy: state.stats.accuracy,
        currentStreak: state.stats.currentStreak,
        longestStreak: state.stats.longestStreak
      },
      fallingWords: adjustedWordArray
    }));
    this.currentEnemy = null;
    this.currentEnemyIndex = null;
    this.TypeSwitch.resetGame();
  };

  concludePath = index => {
    const tiredEnemy = this.state.fallingWords[index];
    this.letters = this.letters = tiredEnemy.word.charAt(0);
    if (this.currentEnemy && tiredEnemy.word === this.currentEnemy.word) {
      this.currentEnemy = null;
      this.currentEnemyIndex = null;
      this.TypeSwitch.resetGame();
      document.addEventListener('keypress', this.findWord, false);
    }

    let adjustedWordArray = this.state.fallingWords;
    adjustedWordArray[index].isDead = true;
    this.setState({
      fallingWords: adjustedWordArray
    });
    let remainingEnemies = this.state.fallingWords.filter(enemy => {
      return !enemy.isDead;
    });
    if (!remainingEnemies.length) {
      this.queueNextWave();
    }
  };

  handleClick = () => {
    this.queueNextWave(true);
  };

  gameOver = () => {
    console.log('you lost man');
    document.removeEventListener('keypress', this.findWord);
    this.messageType = 'gameOver';
    this.TypeSwitch.broadcast('gameOver');
    this.setState({
      fallingWords: [],
      waveLaunching: false,
      waveCount: 0
    });
    this.totalMistakes = 0;
    this.totalKeystrokes = 0;
  };

  render() {
    var message = (
      <Message
        queueNextWave={this.queueNextWave}
        handleClick={this.handleClick}
        messageType={this.messageType}
      />
    );
    const allTheWords = this.state.fallingWords.map(enemy => {
      return enemy.isDead ? null : enemy.Component;
    });
    return (
      <ThemeProvider theme={theme}>
        <Box display="grid" backgroundColor="primaryLight">
          <div> Score {this.state.stats.score}</div>
          <Box
            id="app-content"
            height="800px"
            width="620px"
            m="50px auto"
            backgroundColor="gray200"
          >
            <div id="word-space">{allTheWords}</div>
            {message}
          </Box>
          <GlobalStyle />
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
