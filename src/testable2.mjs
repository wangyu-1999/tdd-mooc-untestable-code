export function defaultRandomGenerator() {
  return Math.random();
}
export function diceRoll(randomGenerator = defaultRandomGenerator) {
  const min = 1;
  const max = 6;
  return Math.floor(randomGenerator() * (max + 1 - min) + min);
}

export function diceHandValue(randomGenerator = defaultRandomGenerator) {
  const die1 = diceRoll(randomGenerator);
  const die2 = diceRoll(randomGenerator);
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}
