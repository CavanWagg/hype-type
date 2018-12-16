import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Word extends Component {
  render() {
    return (
      <div className="wordContainer" data-container={this.props.enemyIndex}>
        <div className="word" data-word={this.props.enemyIndex}>
          {this.props.letterArray}
          <i data-enemy={this.props.enemyIndex} />
        </div>
      </div>
    );
  }
}

Word.propTypes = {
  letterArray: PropTypes.array.isRequired,
  containerIdentifier: PropTypes.string.isRequired,
  enemyIndex: PropTypes.number.isRequired
};
