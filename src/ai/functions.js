import { first } from "../helpers/arrayHelpers";

export const doStatLogic = (stats, gambits) => {
  const result = first(
    gambits
      .sort((a, b) => a.priority - b.priority)
      .filter(({ condition, statId }) => {
        const currentStat = stats.find(({ id }) => id === statId);
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
