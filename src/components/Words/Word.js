import React, { Component } from 'react';

// Globals

export default class Word extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p>
        {this.props.word.lettersTyped.map(letter => <span className="typed">{letter}</span>)}
        {this.props.word.lettersLeft.join('')}
      </p>
    );
  }
}
