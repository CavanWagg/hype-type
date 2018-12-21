import React, { Component } from 'react';

// Globals

export default class Word extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p>
        <span className="typed">{this.props.word.lettersTyped.join('')}</span>
        {this.props.word.lettersLeft.join('')}
      </p>
    );
  }
}
