import React, { Component } from 'react';

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
          <div className="begin">
            <h1>Hype-Type</h1>
            <button
              onClick={() => {
                this.handleClick();
              }}
            >
              Begin
            </button>
          </div>
        );
        break;
      case 'gameOver':
        message = <h1>Game Over</h1>;
        break;
      case 'playingGame':
        message = null;
    }
    return <div id="messageContainer">{message}</div>;
  }
}
