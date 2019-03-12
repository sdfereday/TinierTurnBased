export default ({
  ownerId,
  name,
  exitParams,
  _isComplete = false,
  _exited = false
}) => ({
  id: "onHit",
  isComplete: () => _isComplete,
  hasExited: () => _exited,
  enter() {
    console.log("========== 2 ==========");
    console.log(
      "%c -> Entered onDamaged State" + ownerId,
      "background: #f8d7da; color: #721c24"
    );

    setTimeout(() => {
      _isComplete = true;
      console.log(
        "%c -> Finished onDamaged animation!",
        "background: #f8d7da; color: #721c24"
      );
    }, 2000);
  },
  update() {
    // ...
  },
  exit() {
    console.log(
      "%c <- Exited onDamaged State" + ownerId,
      "background: #f8d7da; color: #721c24"
    );
    _exited = true;

    if (exitParams) {
      exitParams.onExit();
    }
  },
  fail(code) {
    // ...
  }
});
