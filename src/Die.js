import React, { Component } from 'react';
import './Die.css';

class Die extends Component {
  static defaultProps = {
    dicesIcons: [
      <i className="fas fa-dice-one"></i>,
      <i className="fas fa-dice-two"></i>,
      <i className="fas fa-dice-three"></i>,
      <i className="fas fa-dice-four"></i>,
      <i className="fas fa-dice-five"></i>,
      <i className="fas fa-dice-six"></i>,
    ],
  };
  constructor(props) {
    super(props);
    this.aniStart = this.aniStart.bind(this);
    this.aniEnd = this.aniEnd.bind(this);
    this.state = {
      isRolling: false,
    };
  }

  aniStart() {
    this.setState({ isRolling: true });
  }

  aniEnd() {
    this.setState({ isRolling: false });
  }

  render() {
    const { isRolling } = this.state;
    const { dicesIcons, isRendering, idx, rollsLeft, val } = this.props;
    return (
      <button
        className={`Die ${
          this.props.locked
            ? 'Die-locked'
            : `${isRendering ? 'Die-rolling' : ''}`
        }`}
        onClick={() => {
          this.props.handleClick(idx);
        }}
        onAnimationStart={this.aniStart}
        onAnimationEnd={this.aniEnd}
        disabled={isRolling || rollsLeft <= 0}
      >
        {dicesIcons[val - 1]}
      </button>
    );
  }
}

export default Die;
