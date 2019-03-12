export const manualLoop = (fn, fps = 200) => {
  setTimeout(() => {
    if (fn) {
      fn();
      manualLoop(fn, fps);
    }
  }, fps);
};

export default G => {
  const main = tFrame => {
    if (!G) return;
    G.stopMain = window.requestAnimationFrame(main);
    const { update } = G;
    update.call(G, tFrame);
  };
  main();
};
