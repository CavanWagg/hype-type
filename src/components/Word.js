import React, { Component } from 'react';

export default class Word extends Component {
  render() {
    return (
      <div className="wordContainer">
        <div className="the-word">{this.props.letterArray}</div>
      </div>
    );
  }
}
