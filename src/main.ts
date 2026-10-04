import WebGPUGameApplication from "./webgpu-application/webGPUApplication";
import { generateGame } from "./game";
import "./style.css";

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#game");
  if (!canvas) {
    return;
  }
  const game = await generateGame();

  const webGPUgameApplication = new WebGPUGameApplication({
    canvas,
    game,
  });
  await webGPUgameApplication.init();
  webGPUgameApplication.render();
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
