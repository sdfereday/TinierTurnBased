import { manualLoop } from "./utils/gameloop";
import { createTurnIterator } from "./utils/turnGenerator";
import queueStateMachine from "./fsm/queueStateMachine";
import actor from "./entities/actor";

const actorQueueState = queueStateMachine();

const actorSam = actor("Sam", actorQueueState);
const actorGnoll = actor("Gnoll", actorQueueState);
const actors = [actorSam, actorGnoll];

const turnIterator = createTurnIterator(actors);

const requiredComplete = [actorQueueState].concat(actors);

actorSam.setTarget(actorGnoll);
actorGnoll.setTarget(actorSam);

manualLoop(() => {
  actorQueueState.update();
  actors.forEach(x => x.update());

  if (requiredComplete.every(x => x.currentStateComplete())) {
    const nextTurnTaker = turnIterator.getNextValue();
    console.log(
      "%c" + nextTurnTaker.name + "'s turn.",
      "background: #e2e3e5; color: #383d41"
    );

    actors.map(x => x.onTurnChanged());
    nextTurnTaker.decide();
  }
}, 200);
