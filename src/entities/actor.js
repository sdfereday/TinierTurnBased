import { guid } from "../helpers/dataHelpers";
import normalStateMachine from "../fsm/normalStateMachine";
import stateRegistry from "../states/stateRegistry";

export default (name, globalFSM, _id = guid(), _target = null) => {
  const internalFSM = normalStateMachine();

  return {
    name,
    setTarget: target => {
      console.log(name + "'s target was set to " + target.name + ".");
      _target = target;
    },
    update: () => internalFSM.update(),
    decide: () => {
      console.log(name + " is deciding what to do...");

      const onAttack = stateRegistry.get("onAttack");
      const attackState = onAttack({
        ownerId: _id,
        target: _target,
        name
      });

      globalFSM.push(attackState);
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
