import { guid } from "../helpers/dataHelpers";
import { first } from "../helpers/arrayHelpers";
import { clamp } from "../helpers/numberHelpers";
import normalStateMachine from "../fsm/normalStateMachine";
import onAttack from "../states/onAttack";
import onHit from "../states/onHit";
import onCounter from "../states/onCounter";
import onBreak from "../states/onBreak";

// Could be any old thing relating to this entity (think gambits)
const gambitMap = [
  {
    gambitId: "UseAttack", // Just an id for this gambit, no critical
    statId: "hp", // Must match stats object key
    stateOnTrue: "onAttack", // Must match the id of needed state
    condition: (current, max) => current >= max // Called by logic parser
  },
  {
    gambitId: "UsePotion",
    statId: "hp",
    stateOnTrue: "onPotion",
    condition: (current, max) => current < max
  }
];

const statFactory = {
  hp: max => {
    let _current = max;
    let _max = max;
    let _min = 0;
    return {
      id: "hp",
      value: () => _current,
      max: () => _max,
      increaseValue: value => {
        _current = clamp(_current + value, _min, _max);
      },
      decreaseValue: value => {
        _current = clamp(_current - value, _min, _max);
      }
    };
  }
};

const doStatLogic = (stats, gambits) => {
  const result = first(
    gambits.filter(({ condition, statId }) => {
      const currentStat = stats.find(({ id }) => id === statId);
      return currentStat && condition(currentStat.value(), currentStat.max());
    })
  );

  return result ? result.stateOnTrue : null;
};

export default (name, globalFSM, _id = guid(), _target = null) => {
  // Single source of truth for entities stats
  const myStats = [statFactory.hp(100)];

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
      console.log(name + " is deciding what to do...");

      const stateResult = doStatLogic(myStats, gambitMap);

      console.log("Result?");
      console.log(stateResult);

      const pauseState = onBreak({
        ownerId: _id,
        name
      });

      globalFSM.push(pauseState);
    },
    hit: ({ damage, originData }) => {
      console.log(name + " got a hit from " + originData.name + ".");

      const hitState = onHit({
        ownerId: _id,
        name,
        exitParams: {
          onExit: () => {
            console.log(name + " decided to counter " + originData.name + ".");

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
