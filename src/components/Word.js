import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Word extends Component {
  
  componentDidMount() {
    const appContent = document.getElementById("app-content");
    const box = document.getElementById(`box${this.props.id}`);
    const rNum = Math.random();
    const distanceEachFrame = rNum < 0.2 ? (
      0.2
    ) : (
      rNum > 0.8 ? 0.8 : rNum
    );
    requestAnimationFrame(() => {
      let position = 0;
      const cb = () => {
        position += distanceEachFrame;
        box.style.top = `${position}px`;
        if ((position < (appContent.clientHeight - box.clientHeight - 20)) && !this.props.isDead) {
          requestAnimationFrame(cb);
        } else {
          console.log("dead");
        }
      }
      if ((position < (appContent.clientHeight - box.clientHeight - 20)) && !this.props.isDead) {
        requestAnimationFrame(cb);
      } else {
        console.log("dead");
      }
    });
  }
  
  render() {
    return (
      <div className="wordContainer" data-container={this.props.enemyIndex}>
        {this.props.isDead ? (
          null
        ) : (
          <div id={`box${this.props.id}`} className="word" data-word={this.props.enemyIndex}>
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
