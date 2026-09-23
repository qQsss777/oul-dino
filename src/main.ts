import GameApplication from "./application/application";
import { generateGame } from "./game";
import "./style.css";

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#game");
  if (!canvas) {
    return;
  }
  const backgroundColor: [number, number, number, number] = [
    0.4, 0.87, 0.93, 1,
  ];
  const game = await generateGame();

  const gameApplication = new GameApplication({
    canvas,
    game,
    backgroundColor,
  });
  await gameApplication.init();
  gameApplication.render();
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
