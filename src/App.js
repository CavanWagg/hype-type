import React, { Component } from 'react';
import './App.css';
import Word from './components/Words/Word';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

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
      words: [],
      currentWordIndex: 'none'
    };
    this.setWords = this.setWords.bind(this);
    this.trackKeysInWords = this.trackKeysInWords.bind(this);
    this.init = this.init.bind(this);
  }

  setWords(words) {
    return words.map(word => ({
      word,
      lettersTyped: [],
      lettersLeft: word.split('')
    }));
  }
  
  trackKeysInWords(e) {
    this.setState(state => {
      let stateUpdate;
      if (state.currentWordIndex === 'none') {
        for (let i = 0; i < state.words.length; i++) {
          if (e.key === state.words[i].lettersLeft[0]) {
            stateUpdate = { 
              currentWordIndex: i,
              words: state.words.map((word, index) => {
                if (index === i) {
                  return {
                    word: word.word,
                    lettersTyped: word.lettersLeft.slice(0, 1),
                    lettersLeft: word.lettersLeft.slice(1)
                  };
                }
                return word;
              })
            };
            break;
          }
        }
      } else if (e.key === state.words[state.currentWordIndex].lettersLeft[0]) {
        stateUpdate = {
          words: state.words.map((word, index) => {
            if (index === state.currentWordIndex) {
              return {
                word: word.word,
                lettersTyped: word.lettersTyped.concat(word.lettersLeft.slice(0, 1)),
                lettersLeft: word.lettersLeft.slice(1)
              };
            }
            return word;
          })
        };
        if (stateUpdate.words[state.currentWordIndex].lettersLeft.length === 0) {
          stateUpdate.currentWordIndex = 'none';
          stateUpdate.score = state.score + 1;
        }
      }
      return stateUpdate;
    });
  }

  init() {
    this.setState({ isPlaying: true, words: this.setWords(words) });
    window.addEventListener('keypress', this.trackKeysInWords);
  }

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
          {
            this.state.words.length > 0 ? (
              this.state.words.map((word, i) => (
                <Word word={word} key={i} />
              ))
            ) : (
              null
            )
          }
        </AppContent>
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

export default App;
