export const genericGambit = [
  {
    gambitId: "UseAttack", // Not critical, but helps identify current gambit
    statId: "hp", // The stat this gambit will monitor for its condition method
    stateOnTrue: "onAttack", // Must match the id of needed state
    priority: 3, // The closer to '0', the higher the priority (can change)
    condition: (current, ceil) => current >= ceil // Called by logic parser
  },
  {
    gambitId: "UsePotion",
    statId: "hp", // Support for multiple stats in future planned : ["hp", "mp"], etc.
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
