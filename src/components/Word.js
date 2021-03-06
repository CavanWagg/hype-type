import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Word extends Component {
  componentDidMount() {
    // this.myTween = TweenMax.to(this.myElement, 1, { x: 100, y: 100 });
    const appContent = document.getElementById('app-content');
    const box = document.getElementById(`box${this.props.id}`);
    const rNum = Math.random();

    const distanceEachFrame = rNum < 0.2 ? 0.2 : rNum > 0.9 ? 0.9 : rNum;
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
        if (!this.props.isDead) {
          if (
            positionX <
            appContent.clientHeight -
              box.clientHeight -
              20 +
              topPositionAdjustment
          ) {
            requestAnimationFrame(animate);
          }
        } else {
        }
        if (positionX > 750) {
          this.props.gameOver();
        }
      };

      if (!this.props.isDead) {
        if (
          positionX <
          appContent.clientHeight -
            box.clientHeight -
            20 +
            topPositionAdjustment
        ) {
          requestAnimationFrame(animate);
        }
      }
    });
  }

  render() {
    const style = {
      position: 'relative',
      top: this.props.row < 2 ? 0 : this.props.row < 3 ? -30 : -60
    };
    return (
      <div
        id={`container${this.props.id}`}
        className="wordContainer"
        data-container={this.props.enemyIndex}
      >
        {this.props.isDead ? (
          <div
            id={`box${this.props.id}`}
            className="word removed-item"
            style={style}
            data-word={this.props.enemyIndex}
          >
            {this.props.letterArray}
            <i data-enemy={this.props.enemyIndex} />
          </div>
        ) : (
          <div
            id={`box${this.props.id}`}
            className="word"
            style={style}
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
