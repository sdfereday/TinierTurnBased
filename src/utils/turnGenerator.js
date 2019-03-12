const generator = arr =>
  function* turnQueue() {
    for (let i = 0; i < arr.length; i++) {
      yield arr[i];
    }
  };

const createGenerator = arr => generator(arr)();

export const createTurnIterator = arr => {
  let g = createGenerator(arr);

  return {
    getNextValue: () => {
      const next = g.next();
      if (next.done) {
        g = createGenerator(arr);
        return g.next().value;
      }

      return next.value;
    }
  };
};
