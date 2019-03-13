export default ({
  ownerId,
  name,
  target,
  exitParams,
  _isComplete = false,
  _exited = false
}) => ({
  id: "onBreak",
  isComplete: () => _isComplete,
  hasExited: () => _exited,
  enter() {
    console.log(name + " entered a break state for debug purposes.");
  },
  update() {
    // ...
  },
  exit() {
    // ...
  },
  fail(code) {
    // ...
  }
});
