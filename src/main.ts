import GameApplication from "./webgpu-application/application";
import { generateGame } from "./game";
import "./style.css";

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#game");
  if (!canvas) {
    return;
  }
  const game = await generateGame();

  const gameApplication = new GameApplication({
    canvas,
    game,
  });
  await gameApplication.init();
  gameApplication.render();
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
