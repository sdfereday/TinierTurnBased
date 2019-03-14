export const genericGambit = [
  {
    gambitId: "UseAttack", // Just an id for this gambit, no critical
    statId: "hp", // Must match stats object key
    stateOnTrue: "onAttack", // Must match the id of needed state
    priority: 3, // The closer to '0', the higher the priority (can change)
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
    statId: "status",
    stateOnTrue: "onBreak", //"onAntidote",
    priority: 1,
    condition: currentAilment => currentAilment === "poison"
  }
];
