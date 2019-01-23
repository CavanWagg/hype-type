import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@smooth-ui/core-sc';

export default class Word extends Component {
  componentDidMount() {
    const appContent = document.getElementById('app-content');
    let box = document.getElementById(`box${this.props.id}`);
    const rNum = Math.random();

    const distanceEachFrame = rNum < 0.4 ? 0.4 : rNum > 0.9 ? 0.9 : rNum;
    const moveSideFunc =
      this.props.id % 2 === 0
        ? function(angle) {
            return Math.sin(angle);
          }
        : function(angle) {
            return Math.sin(0 - angle);
          };
    requestAnimationFrame(() => {
      const topPositionAdjustment =
        this.props.row < 2 ? 0 : this.props.row < 3 ? -30 : -60;
      let positionX = topPositionAdjustment;
      let positionY = 0;
      const animate = () => {
        positionX += distanceEachFrame;
        positionY += distanceEachFrame;
        box.style.top = `${positionX}px`;
        box.style.left = `${50 * moveSideFunc(positionY / 50)}px`;
        if (positionX > 740) {
          this.props.gameOver();
        }
        if (
          positionX <
          appContent.clientHeight -
            box.clientHeight -
            20 +
            topPositionAdjustment
        ) {
          requestAnimationFrame(animate);
        }
      };

      console.log(positionX);
      if (
        positionX <
        appContent.clientHeight - box.clientHeight - 20 + topPositionAdjustment
      ) {
        requestAnimationFrame(animate);
      }
    });
  }

  render() {
    const style = {
      background: 'blue',
      position: 'relative',
      padding: '5px 10px 0px 10px',
      borderRadius: '50%',
      display: 'flex',
      top: this.props.row < 2 ? 0 : this.props.row < 3 ? -30 : -60
    };
    return (
      <div
        className="wordContainer"
        id={`container${this.props.id}`}
        data-container={this.props.enemyIndex}
      >
        <div
          id={`box${this.props.id}`}
          className={`fade`}
          data-word={this.props.enemyIndex}
          style={style}
        >
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
