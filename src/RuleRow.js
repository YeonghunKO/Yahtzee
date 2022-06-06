import React, { Component } from 'react';
import './RuleRow.css';
import { descriptionByName } from './description';

class RuleRow extends Component {
  constructor(props) {
    super(props);
    this.handClick = this.handClick.bind(this);
  }

  handClick() {
    if (this.props.score === undefined) {
      this.props.doScore();
    }
  }
  render() {
    const { score, name } = this.props;
    return (
      <tr
        className={`RuleRow ${
          score === undefined ? 'RuleRow-active' : 'RuleRow-disabled'
        }`}
        onClick={this.handClick}
      >
        <td className="RuleRow-name">{name}</td>
        <td className="RuleRow-score">
          {score === undefined ? `${descriptionByName(name)}` : score}
        </td>
      </tr>
    );
  }
}
//
export default RuleRow;
