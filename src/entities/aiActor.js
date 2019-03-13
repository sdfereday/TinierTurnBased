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
    priority: 3,
    condition: (current, ceil) => current >= ceil // Called by logic parser
  },
  {
    gambitId: "UsePotion",
    statId: "hp",
    stateOnTrue: "onPotion",
    priority: 2,
    condition: (current, ceil) => current < ceil
  },
  {
    gambitId: "UseAntidote",
    statId: "poison",
    stateOnTrue: "onAntidote",
    priority: 1,
    condition: currentAilment => currentAilment === "poison"
  }
];

const statRegistry = {
  status: (effectiveStatuses = []) => {
    let _currentStatus = null;
    return {
      setStatus: type => effectiveStatuses.find(status => status.type === type),
      value: () => (_currentStatus ? _currentStatus.type : null)
    };
  },
  hp: ceil => {
    let _current = ceil;
    let _ceil = ceil;
    let _min = 0;
    return {
      id: "hp",
      value: () => _current,
      ceil: () => _ceil,
      increaseValue: value => {
        _current = clamp(_current + value, _min, _ceil);
      },
      decreaseValue: value => {
        _current = clamp(_current - value, _min, _ceil);
      }
    };
  }
};

const doStatLogic = (stats, gambits) => {
  const result = first(
    gambits
      .sort((a, b) => a.priority - b.priority)
      .filter(({ condition, statId }) => {
        const currentStat = stats.find(({ id }) => id === statId);
        if (currentStat) {
          // This won't work for status since it doesn't match the key.
          console.log(currentStat.value());
        }
        return (
          currentStat &&
          condition(
            currentStat.value(),
            currentStat.ceil ? currentStat.ceil() : null
          )
        );
      })
  );

  return result ? result.stateOnTrue : null;
};

export default (name, globalFSM, _id = guid(), _target = null) => {
  // Single source of truth for entities stats
  const hp = statRegistry.hp(100);
  const currentStatus = statRegistry.status([
    {
      type: "poison",
      dmg: 1,
      ticks: 3
    }
  ]);

  // To test
  currentStatus.setStatus("poison");

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
      const stateResult = doStatLogic([hp, currentStatus], gambitMap);

      console.log(stateResult);

      switch (stateResult) {
        case "onPoisoned":
          globalFSM.push(
            onBreak({
              ownerId: _id,
              name
            })
          );
          break;
        // case "onAttack":
        //   globalFSM.push(
        //     onAttack({
        //       ownerId: _id,
        //       target: _target,
        //       name
        //     })
        //   );
        //   break;
        default:
          globalFSM.push(
            onBreak({
              ownerId: _id,
              name
            })
          );
      }
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
