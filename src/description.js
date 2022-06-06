const descriptionByName = name => {
  let des = '';
  switch (name) {
    case 'Ones':
    case 'Twos':
    case 'Threes':
    case 'Fours':
    case 'Fives':
    case 'Sixes':
      des = `Score ${name} for every ${name}`;
      break;
    case 'Three of Kind':
      des = `If 3 are the same, sum all dice`;
      break;
    case 'Four of Kind':
      des = `If 4 are the same, sum all dice`;
      break;
    case 'Full House':
      des = `3 are the same, so are the other two, score 25`;
      break;
    case 'Small Straight':
      des = 'If 4+ values in a row, score 30';
      break;
    case 'Large Straight':
      des = `If 5 values in a row, score 40`;
      break;
    case 'Yahtzee':
      des = `If all values match, score 50`;
      break;
    case 'Chance':
      des = `Score sum of all dice`;
      break;
    default:
      console.log('invalid row name');
      break;
  }
  return des;
};

export { descriptionByName };
