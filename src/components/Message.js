import React, { Component } from 'react';
import { Button, Typography } from '@smooth-ui/core-sc';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.props.queueNextWave();
    console.log('click');
    return (this.messageType = 'playingGame');
  };
  render() {
    var message;
    switch (this.props.messageType) {
      case 'startGame':
        message = (
          <div className="message-div">
            <Typography variant="display-3">Hype Type</Typography>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                this.handleClick();
              }}
            >
              Begin
            </Button>
          </div>
        );
        break;
      case 'gameOver':
        message = (
          <div className="message-div">
            <h1>Game Over</h1>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                this.handleClick();
              }}
            >
              Play Again
            </Button>
          </div>
        );
        break;
      case 'playingGame':
        message = null;
    }
    return <div id="messageContainer">{message}</div>;
  }
}
