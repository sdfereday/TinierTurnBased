import { guid } from "../helpers/dataHelpers";
import normalStateMachine from "../fsm/normalStateMachine";
import stateRegistry from "../states/stateRegistry";
import { genericGambit } from "../ai/gambits";
import { doStatLogic } from "../ai/functions";
import stats from "../data/stats";
import { poison } from "../data/statuses";

export default (name, globalFSM, _id = guid(), _target = null) => {
  // TODO: Ensure you're getting individual instances of stats, it may not
  // be the case if 'stats' is just being exported as an object.
  const hp = stats.hp(100);
  // Statuses that this entity are susceptible to a pushed here.
  const susceptibleStatuses = stats.status([poison]);

  // You'd usually set this on hit if the thing has a latent effect on it
  susceptibleStatuses.setStatus("poison");
  // ...

  // Internal fsm handles all personal actions (animations, etc)
  const internalFSM = normalStateMachine();

  return {
    name,
    setTarget: target => {
      console.log(name + "'s target was set to " + target.name + ".");
      _target = target;
    },
    update: () => internalFSM.update(),
    decide: () => {
      // So you can actually swap out different gambits depending on the mode
      // the entity is in. You could potentially have a gambit that specifies
      // gambits to use.
      console.log(name + " is deciding what to do...");
      const stateResult = doStatLogic([hp, susceptibleStatuses], genericGambit);
      const chosenState = stateRegistry.get(stateResult);
      console.log("Chose state:", stateResult);

      // Using this methods 'assumes' that all states take the same sort of data.
      globalFSM.push(
        chosenState({
          ownerId: _id,
          target: _target,
          name
        })
      );
    },
    hit: ({ damage, originData }) => {
      console.log(name + " got a hit from " + originData.name + ".");

      const onHit = stateRegistry.get("onHit");
      const hitState = onHit({
        ownerId: _id,
        name,
        exitParams: {
          onExit: () => {
            console.log(name + " decided to counter " + originData.name + ".");

            const onCounter = stateRegistry.get("onCounter");
            const counterState = onCounter({
              ownerId: _id,
              target: _target,
              name
            });

            globalFSM.push(counterState);
          }
        }
      });

      internalFSM.push(hitState);
    },
    counterHit: ({ damage, originData }) => {
      console.log(
        name + " got a counter attack hit from " + originData.name + "."
      );

      const onHit = stateRegistry.get("onHit");
      const hitState = onHit({
        ownerId: _id,
        name
      });

      internalFSM.push(hitState);
    },
    currentStateComplete: () => internalFSM.currentStateComplete(),
    onTurnChanged: () => {}
  };
};
