/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter(d => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
  evalRoll = dice => {
    return this.val * super.count(dice, this.val);
  };
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
  evalRoll = dice => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some(c => c >= this.count) ? this.sum(dice) : 0;
  };
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule {
  evalRoll = dice => {
    const freq = this.freq(dice);
    return freq.length === 2 && freq.every(f => f >= 2) ? this.score : 0;
  };
}

/** Check for small straights. */

class SmallStraight {
  constructor(props) {
    Object.assign(this, props);
  }

  // dice를 sort해서 바로 앞에 있는 원소와의 차이를 구함
  // 그래서 차이의 합이 3이 나와야 함.
  // 근데 콜트처럼 쌈빡하게 연산자를 사용해서 알고리즘 구현하고 싶다,...ㅠ

  // 1,2 또는 5,6 둘중에 하나만 꼭 나와야 함.

  evalRoll = dice => {
    const diceSet = new Set(dice);

    let res1;
    let res2;

    if (diceSet.size < 4) {
      return 0;
    }

    const diceArr = Array.from(diceSet);
    diceArr.sort((a, b) => a - b);

    function calSeq(arr) {
      let seq = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] - arr[i] === 1) {
          seq += 1;
        } else {
          break;
        }
      }
      return seq;
    }

    if (diceArr.length >= 4) {
      res1 = calSeq(diceArr.slice(0, 4));
      res2 = calSeq(diceArr.slice(1, 5));
    }

    return res1 >= 3 || res2 >= 3 ? this.score : 0;
  };
}

/** Check for large straights. */

class LargeStraight {
  constructor(props) {
    Object.assign(this, props);
  }
  evalRoll = dice => {
    const d = new Set(dice);
    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
  evalRoll = dice => {
    // all dice must be the same
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 });
const twos = new TotalOneNumber({ val: 2 });
const threes = new TotalOneNumber({ val: 3 });
const fours = new TotalOneNumber({ val: 4 });
const fives = new TotalOneNumber({ val: 5 });
const sixes = new TotalOneNumber({ val: 6 });

// three/four of kind score as sum of all dice
const threeOfKind = new SumDistro({ count: 3 });
const fourOfKind = new SumDistro({ count: 4 });

// full house scores as flat 25
const fullHouse = new FullHouse({ score: 25 });

// small/large straights score as 30/40
const smallStraight = new SmallStraight({ score: 30 });
const largeStraight = new LargeStraight({ score: 40 });

// yahtzee scores as 50
const yahtzee = new Yahtzee({ score: 50 });

// for chance, can view as some of all dice, requiring at least 0 of a kind
const chance = new SumDistro({ count: 0 });

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance,
};
