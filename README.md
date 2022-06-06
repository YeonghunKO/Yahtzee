# Yahtzee
[![Netlify Status](https://api.netlify.com/api/v1/badges/808c7331-83de-4e2f-82e1-490f7d0fcb3b/deploy-status)](https://app.netlify.com/sites/nostalgic-davinci-958000/deploys)

![yatzhee](https://images.velog.io/images/yhko1992/post/fae9ecf9-45a8-42ed-ab02-8c12d89e9170/yazthzee.gif)

# 프로젝트의 목적
유데미에서 yahtzee 라는 게임을 만들어보았다.
주사위를 돌리고나서 나온 숫자를 보고 스코어에 해당하는 점수를 클릭한다.
주사위 결과가 점수를 받을 수 있는 조건에 부합하면 점수를 획득하고 아니면 0점을 얻는다.
모든 스코어를 클릭하면 게임이 끝나고 총합이 기록되면서 다시 시작하겠냐는 물음이 뜬다.

리액트도 배울 뿐 아니라 아니라 로직을 짜는 연습도 확실히 되었다!

[요기서 플레이 가능!](https://yahtzee-completed.netlify.app/)

# 배운점

## react-js

1. Object.assign과 extends 키워드를 통해서 간략하게 클래스를 확장할 수 있다.

```javascript
// Rule.js
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

class TotalOneNumber extends Rule {
  evalRoll = dice => {
    ** super.count라고 해도 상관없다! **
    return this.val * this.count(dice, this.val);
  };
}

// ones, twos, etc score as sum of that value
const ones = new TotalOneNumber({ val: 1 });
const twos = new TotalOneNumber({ val: 2 });
const threes = new TotalOneNumber({ val: 3 });
const fours = new TotalOneNumber({ val: 4 });
const fives = new TotalOneNumber({ val: 5 });
const sixes = new TotalOneNumber({ val: 6 });
twos.evalRoll([2,2,3,1,1]) // 4
```

2. doScore에서 ruleFn을 선별적으로 넘겨받았고 넘겨받은 함수를 통해 점수를 계산했다.

   - 컴포넌트마다 다른 함수를 인자로 넘겨줄 수 있다는 건 진짜 아무리 생각해도 신박하다..

3. 애니메이션이 진행될때는 클릭을 불허해야한다.

   - 그래서 animationstart,end 이벤트를 사용해서 state를 변경하였다.
   - isRolling이 true가 되었다가 false가 되게 하는것이다.
   - 그리고 disabled prop과 isRolling을 결합한다.

```javascript
// Die.js
aniStart() {
  this.setState({ isRolling: true });
}

aniEnd() {
  this.setState({ isRolling: false });
}

render() {
  const { isRolling } = this.state;
  const { dicesIcons, isRendering } = this.props;
  return (
    <button
      className={`Die ${
        this.props.locked
          ? 'Die-locked'
          : `${isRendering ? 'Die-rolling' : ''}`
      }`}
      onClick={() => {
        this.props.handleClick(this.props.idx);
      }}
      onAnimationStart={this.aniStart}
      onAnimationEnd={this.aniEnd}
      disabled={isRolling || this.props.rollsLeft <= 0}
    >
      {dicesIcons[this.props.val - 1]}
    </button>
  );
}
```

4. rolls 버튼을 누를때마다 die class가 새로 랜더링 되어야 한다.

   - 그래야만 애니메이션이 나타나기 때문이다. 그런데 class 이름이 이미 `Die-rolling`인 die에 `Die-rolling` class를 적용하면 랜더링 되지 않고 그대로 존재하여 애니메이션이 안나타난다.

   - 그래서 일단 ''로 만든다음 'Die-rolling'으로 바꿔야한다. 이런저런 삽질을 한 결과 이전 주사위 프로젝트에서 setTimeOut 을 이용해서 클래스를 시간차를 두고 토글한게 생각이나서 그 방법을 적용해보았다.

```javascript
// Game.js
roll(evt) {
  this.setState(st => {
    let totalScore = Object.values(st.scores).reduce((prev, curr) => {
      if (curr !== undefined) {
        return prev + curr;
      } else {
        return prev;
      }
    }, 0);

    return {
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1,
      totalScore,
      isRendering: false,
    };
  });

  setTimeout(() => {
    this.setState(st => ({ isRendering: true }));
  }, 100);
}


render() {
  const { rollsLeft } = this.state;
  return (
    <div className="Game">
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
    <div>
}

// Die.js
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
    >
      {dicesIcons[val - 1]}
    </button>
  );
}

```

reroll 버튼을 누르면 this.roll에서 isRendering을 false로 했다가 몇초뒤에 true로 바뀐다. 그럼 Die에서 isRendering에 따라 class가 바뀌면서(토글되면서) 애니메이션이 살아난다.

아니면 콜트처럼 setState안에 2개의 인자를 추가할 수 있다. setState안에 들어갈 2번째인자는 첫번째가 실행되고 난뒤에 실행이 된다.

```javascript
// Game.js
  animateRoll() {
    this.setState({ rolling: true }, () => {
      setTimeout(this.roll, 1000);
    });
  }

  roll(evt) {
    // roll dice whose indexes are in reroll
    this.setState(st => ({
      dice: st.dice.map((d, i) =>
        st.locked[i] ? d : Math.ceil(Math.random() * 6)
      ),
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1,
      rolling: false
    }));
  }
```

5. this.roll에서 setState를 두번 실행하기 때문에 게임을 재시작이 두번 발생한다.

   - 마지막 RuleRow를 클릭하면 scoreTable에서 isGameFinished가 true가 되면서 Game.js안에 있는 init메소드가 실행이 된다. 문제는 RuleRow로 인해서 Game.js 안에 있는 doScore => roll메소드 순으로 setState가 진행된다.

     - 참고로 scoreTable안에 있는 isGameFinished prop은 Game.js안에 있는 state를 넘겨준 값이다. 즉 ruleRow가 매번 평가 될때마다 Game.roll에서 isGameFinshed 여부를 계산해서 랜더링할때 넘겨준다.

   - 문제는 roll안에서 setState가 두 번 실행이 되기 때문에 (위에서 언급했던 것 처럼 Die.js안에서 class를 토글하기 위해 간격을 두고 setState를 두 번 실행하게 했다는 거 기억하자!) scoreTable안에서 실행이 되고 그럼 또 다시 랜더링 되면서 init이 한 번 더 실행이 된다.

   - 따라서 Game.js - roll메소드 안에서 이미 게임이 끝났으면 setTimeOut을 통한 setState를 clearTimeout을 이용해 취소해야하는 로직을 작성해야한다.

```javascript
// Game.js
let setTimeOutId;

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
```
6. idx를 이용해서 메세지 출력
    - idx를 이용하다니!! 일단 코드부터!
```javascript
//Game.js
  displayRollInfo() {
    const messages = [
      "0 Rolls Left",
      "1 Roll Left",
      "2 Rolls Left",
      "Starting Round"
    ];
    return messages[this.state.rollsLeft];
  }

 render(){
    <button
      className='Game-reroll'
      disabled={locked.every(x => x) || rollsLeft === 0 || rolling}
      onClick={this.animateRoll}
      >
      {this.displayRollInfo()}
    </button>
 }
```
    
## css

1. css에서 cursor:not-allowed라고 하면 커서 금지 표시가 뜬다. 주로 hover랑 같이쓴다.

리액트로 만든 앱중에서 가장 규모가 커서 1주일 가량 머리싸맸지만 단연코 배울게 많은 토이플젝이었다! 그리고 재밌었다! 끝!
