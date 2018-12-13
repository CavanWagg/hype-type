import React, { Component } from 'react';
import './App.css';
import Word from './components/Words/Word';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import TypeSwitch from 'type-switch';

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
const renderedWord = document.querySelector('#rendered-word');
const words = ['ward', 'shout', 'debut', 'rehearsal', 'charge', 'realize'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      isPlaying: false,
      words: []
    };
    this.init = this.init.bind(this);
    // this.createWord = this.createWord.bind(this);
    this.setWords = this.setWords.bind(this);
    this.trackKeys = this.trackKeys.bind(this);
    this.TypeSwitch = new TypeSwitch({ stubbornMode: true });
  }

  setWords(words) {
    return words.map(word => (word.split('')));
  }

  init(e) {
    this.setState({ isPlaying: true, words: this.setWords(words) });
    this.TypeSwitch.start('eventually');
    // this.showWord(words);
    // console.log(renderedWord);
    // console.log(TypeSwitch);
    window.addEventListener('keydown', event => (this.trackKeys(event.key)));
  }
  
  // createWord = array => {
  //   const randIndex = Math.floor(Math.random() * words.length);
  //   return array[randIndex].split('').map((letter, index) => {
  //     var letterElement = (
  //       <p className="letter" key={index}>
  //         {letter}
  //       </p>
  //     );
  //     return letterElement;
  //   });
  // };
  // match currentWord to keyInput
  trackKeys(key) {
    console.log(key);
  }

  render() {
    console.log(this.state);
    return (
      <AppWrapper className="wrapper">
        <AppHeader> Hype Type</AppHeader>
        <AppSidebar>
          {' '}
          Score {this.state.score}
          <button onClick={this.init}>Start</button>
        </AppSidebar>
        <AppContent>
          {/* Game Content */}
          {
            this.state.words ? (
              this.state.words.map((word, i) => (
                <Word word={word.join('')} key={i} />
              ))
            ) : (
              null
            )
          }
          {/*<h2>{this.state.words}</h2> */}
        </AppContent>

        {/* <footer className="footer">My footer</footer> */}
        <GlobalStyle />
      </AppWrapper>
    );
  }
}

export default App;
