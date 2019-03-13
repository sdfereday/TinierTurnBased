import { manualLoop } from "./utils/gameloop";
import { createTurnIterator } from "./utils/turnGenerator";
import queueStateMachine from "./fsm/queueStateMachine";
import actor from "./entities/actor";
import aiActor from "./entities/aiActor";

const actorQueueState = queueStateMachine();

const actorGnoll = aiActor("Gnoll", actorQueueState);
const actorSam = actor("Sam", actorQueueState);
const actors = [actorGnoll, actorSam];

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
