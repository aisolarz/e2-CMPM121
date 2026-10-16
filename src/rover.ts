export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

type Command = {
  label: string;
  run: () => void;
};

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

const grid_max = 4;

const pendingCommands: Command[] = [];
const pendingList = document.querySelector<HTMLElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;
runButton.disabled = false;
clearButton.disabled = false;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

function moveWithinGrid(position: number, change: number): number {
  return Math.max(0, Math.min(grid_max, position + change));
}

function renderPending() {
  pendingList.replaceChildren();
  for (let index = 0; index < pendingCommands.length; index++) {
    const item = document.createElement("li");
    item.textContent = pendingCommands[index].label;
    pendingList.append(item);
  }
  queueStatus.textContent = pendingCommands.length === 0
    ? "Empty"
    : `${pendingCommands.length} pending`;
}

const forwardCommand: Command = {
  label: "Forward",
  run: () => {
    const current = directions[direction];
    x = moveWithinGrid(x, current.dx);
    y = moveWithinGrid(y, current.dy);
  },
};

const rightCommand: Command = {
  label: "Right",
  run: () => {
    direction = (direction + 1) % directions.length;
  },
};

function enqueueCommand(command: Command) {
  pendingCommands.push(command);
  renderPending();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(forwardCommand);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(rightCommand);
};

runButton.onclick = () => {
  for (let index = 0; index < pendingCommands.length; index++) {
    pendingCommands[index].run();
  }
  pendingCommands.length = 0;
  renderPending();
  drawRover();
};

clearButton.onclick = () => {
  pendingCommands.length = 0;
  renderPending();
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  pendingCommands.length = 0;
  renderPending();
  drawRover();
};
renderPending();
drawRover();
