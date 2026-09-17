import GameApplication from "./application";
import game from "./game";
import "./style.css";

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>("#game");
  if (!canvas) {
    return;
  }
  const backgroundColor: [number, number, number, number] = [
    0.8, 0.86, 0.22, 1,
  ];
  const gameApplication = new GameApplication({
    canvas,
    game,
    backgroundColor,
  });
  await gameApplication.init();
  gameApplication.render();
}
main();
