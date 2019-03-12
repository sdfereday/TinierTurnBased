export default ({
  ownerId,
  name,
  target,
  exitParams,
  _isComplete = false,
  _exited = false
}) => ({
  id: "onAttack",
  isComplete: () => _isComplete,
  hasExited: () => _exited,
  enter() {
    console.log("========== 1 ==========");
    console.log(
      "%c -> Entered Attack state " + ownerId,
      "background: #fff3cd; color: #856404"
    );

    setTimeout(() => {
      console.log(
        "%c --> Simulating a fake strike against => " + target.name,
        "background: #fff3cd; color: #856404"
      );
      // Or we use physics hit detection instead (but this way is deterministic).
      target.hit({
        damage: 1,
        originData: {
          ownerId,
          name
        }
      });
    }, 500);

    // Waits for user input or a conditional choice, etc.
    setTimeout(() => {
      _isComplete = true;
      console.log(
        "%c <- Attack cycle complete by " + name,
        "background: #fff3cd; color: #856404"
      );
    }, 3000);
  },
  update() {
    // ...
  },
  exit() {
    console.log(
      "%c <- Exited Attack State " + ownerId,
      "background: #fff3cd; color: #856404"
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
