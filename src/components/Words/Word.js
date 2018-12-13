import React, { Component } from 'react';

// Globals

export default class Word extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p>{this.props.word}</p>
    );
  }
}
