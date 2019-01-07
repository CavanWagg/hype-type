import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Word extends Component {
  componentDidMount() {
    const appContent = document.getElementById('app-content');
    const box = document.getElementById(`box${this.props.id}`);
    const rNum = Math.random();

    const distanceEachFrame = rNum < 0.2 ? 0.2 : rNum > 0.8 ? 0.8 : rNum;
    const moveSideFunc =
      this.props.id % 2 === 0
        ? function(angle) {
            return Math.sin(angle);
          }
        : function(angle) {
            return Math.sin(0 - angle);
          };
    requestAnimationFrame(() => {
      let position = 0;
      const animate = () => {
        position += distanceEachFrame;
        box.style.top = `${position}px`;
        box.style.left = `${50 * moveSideFunc(position / 50)}px`;
        if (
          position < appContent.clientHeight - box.clientHeight - 20 &&
          !this.props.isDead
        ) {
          requestAnimationFrame(animate);
        } else {
          console.log('dead');
        }
      };
      if (
        position < appContent.clientHeight - box.clientHeight - 20 &&
        !this.props.isDead
      ) {
        requestAnimationFrame(animate);
      } else {
        this.checkForGameOver();
      }
    });
  }

  render() {
    return (
      <div className="wordContainer" data-container={this.props.enemyIndex}>
        {this.props.isDead ? null : (
          <div
            id={`box${this.props.id}`}
            className="word"
            data-word={this.props.enemyIndex}
          >
            {this.props.letterArray}
            <i data-enemy={this.props.enemyIndex} />
          </div>
        )}
      </div>
    );
  }
}

Word.propTypes = {
  letterArray: PropTypes.array.isRequired,
  containerIdentifier: PropTypes.string.isRequired,
  enemyIndex: PropTypes.number.isRequired
};
