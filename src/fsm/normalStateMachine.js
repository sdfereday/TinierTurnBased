import { top, forget } from "../helpers/arrayHelpers";

export default () => {
  let innerState = [];

  return {
    update() {
      if (!innerState.length) return;

      const s = top(innerState);
      s.update();

      if (s.isComplete()) {
        s.exit();
        innerState = forget(s.id, innerState);
      }
    },
    push(state) {
      innerState.push(state);
      top(innerState).enter();
    },
    currentStateComplete: () =>
      innerState.length ? top(innerState).hasExited() : true
  };
};
