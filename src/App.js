import React, { Component } from 'react';
// import './App.css';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import TypeSwitch from 'type-switch';
import Word from './components/Word/Word';

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
const words = ['ward', 'shout', 'debut', 'rehearsal', 'charge', 'realize'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      isPlaying: false,
      word: ''
    };
    this.init = this.init.bind(this);
    this.createWord = this.createWord.bind(this);
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

  init(e) {
    this.setState({ isPlaying: true });
    var theWord = {};
    theWord.letterArray = this.createWord(words);
    console.log(theWord.letterArray);
    return theWord;
  }

  createWord = array => {
    const randIndex = Math.floor(Math.random() * words.length);
    return array[randIndex].split('').map((letter, index) => {
      var letterElement = (
        <p className="letter" key={index}>
          {letter}
        </p>
      );
      return letterElement;
    });
  };
  changeLetterColor = (target, letterIndex) => {
    var wordContainer = document.querySelector(target);
    var letterArray = wordContainer.childNodes;
    for (var i = 0; i < letterIndex; i++) {
      letterArray[i].style.color = '#f44336';
    }
  };

  findWord(e) {
    var pressedCharCode = typeof e.which === 'number' ? e.which : e.keycode;
    var pressedKeyChar = String.fromCharCode(pressedCharCode);
    var wordFound = false;
    this.totalKeystrokes++;

    // if (this.state.word.charAt(0) === pressedKeyChar)
  }
  // reduceLetters(wordBank) {
  //   var availableCharacter = this.letters[
  //     Math.floor(Math.random() * this.letters.length)
  //   ];
  //   var newWord =
  // }

  render() {
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
          <Word
            init={this.init}
            createWord={this.letterElement}
            word={this.theWord}
          >
            {' '}
          </Word>
        </AppContent>

        {/* <footer className="footer">My footer</footer> */}
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

export default App;
