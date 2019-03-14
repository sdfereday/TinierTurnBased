import onAttack from "../states/onAttack";
import onHit from "../states/onHit";
import onCounter from "../states/onCounter";
import onBreak from "../states/onBreak";
import onNotFound from "../states/onNotFound";

const registry = {
  onAttack,
  onHit,
  onCounter,
  onBreak
};

// State registry doesn't have to be used, it's just easier when the required
// state is not determined. But I'm choosing to use it regardless.
export default {
  get: stateKey =>
    Object.keys(registry).some(k => k === stateKey)
      ? registry[stateKey]
      : onNotFound
};
