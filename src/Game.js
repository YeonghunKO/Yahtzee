import React, { Component } from 'react';
import Dice from './Dice';
import ScoreTable from './ScoreTable';
import './Game.css';
import { getItem, setItem } from './storage';

let setTimeOutId;
let isGameFinshied;
const NUM_DICE = 5;
const NUM_ROLLS = 2;
const HIGHEST_SCORE_KEY = 'HIGHEST-SCORE';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dice: Array.from({ length: NUM_DICE }, () =>
        Math.ceil(Math.random() * 6)
      ),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined,
      },
      isGameFinshied: false,
      isRendering: false,
      totalScore: 0,
      highestScore: null,
    };
    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.initGame = this.initGame.bind(this);
  }

  roll(evt) {
    this.setState(st => {
      let totalScore = Object.values(st.scores).reduce((prev, curr) => {
        if (curr !== undefined) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);

      isGameFinshied = true;
      for (const score of Object.values(st.scores)) {
        if (score === undefined) {
          isGameFinshied = false;
          break;
        }
      }

      if (isGameFinshied) {
        clearTimeout(setTimeOutId);
      }

      return {
        dice: st.dice.map((d, i) =>
          st.locked[i] ? d : Math.ceil(Math.random() * 6)
        ),
        locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
        rollsLeft: st.rollsLeft - 1,
        totalScore,
        isRendering: false,
        isGameFinshied,
      };
    });

    setTimeOutId = setTimeout(() => {
      this.setState(st => ({ isRendering: true }));
    }, 100);
  }

  toggleLocked(idx) {
    this.setState(st => ({
      locked: [
        ...st.locked.slice(0, idx),
        !st.locked[idx],
        ...st.locked.slice(idx + 1),
      ],
    }));
  }

  doScore(rulename, ruleFn) {
    // evaluate this ruleFn with the dice and score this rulename
    this.setState(st => ({
      scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) },
      rollsLeft: NUM_ROLLS + 1,
      locked: Array(NUM_DICE).fill(false),
    }));
    this.roll();
  }

  initGame() {
    if (getItem(HIGHEST_SCORE_KEY, null) === null) {
      alert('Congrats! You just set a first record!');
      setItem(HIGHEST_SCORE_KEY, this.state.totalScore);
    } else {
      if (this.state.totalScore > getItem(HIGHEST_SCORE_KEY)) {
        alert('Congrats! You just set a new record!');
        setItem(HIGHEST_SCORE_KEY, this.state.totalScore);
      }
    }
    if (
      window.confirm(
        `Game is Over. Total score is ${this.state.totalScore}. Continue?`
      )
    ) {
      this.setState({
        dice: Array.from({ length: NUM_DICE }, () =>
          Math.ceil(Math.random() * 6)
        ),
        locked: Array(NUM_DICE).fill(false),
        rollsLeft: NUM_ROLLS,
        scores: {
          ones: undefined,
          twos: undefined,
          threes: undefined,
          fours: undefined,
          fives: undefined,
          sixes: undefined,
          threeOfKind: undefined,
          fourOfKind: undefined,
          fullHouse: undefined,
          smallStraight: undefined,
          largeStraight: undefined,
          yahtzee: undefined,
          chance: undefined,
        },
        isRendering: true,
        totalScore: 0,
        isGameFinshied: false,
      });
    } else {
      this.setState({
        isGameFinshied: false,
        locked: Array(NUM_DICE).fill(true),
        rollsLeft: 0,
      });
    }
  }

  render() {
    const { rollsLeft } = this.state;
    return (
      <div className="Game">
        <header className="Game-header">
          <div className="highest-score">
            Highest Score: {getItem(HIGHEST_SCORE_KEY) || 0}
          </div>
          <h1 className="App-title">Yahtzee!</h1>

          <section className="Game-dice-section">
            <Dice
              dice={this.state.dice}
              locked={this.state.locked}
              handleClick={this.toggleLocked}
              rollsLeft={rollsLeft}
              isRendering={this.state.isRendering}
            />
            <div className="Game-button-wrapper">
              <button
                className="Game-reroll"
                disabled={rollsLeft <= 0}
                onClick={this.roll}
              >
                {rollsLeft} {rollsLeft > 1 ? 'Rolls' : 'Roll'} Left
              </button>
            </div>
          </section>
        </header>
        <ScoreTable
          totalScore={this.state.totalScore}
          doScore={this.doScore}
          scores={this.state.scores}
          initGame={this.initGame}
          isGameFinshied={this.state.isGameFinshied}
        />
      </div>
    );
  }
}

export default Game;
