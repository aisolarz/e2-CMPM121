export {};

const crew_size = 6;
const supplies_per_crew_member = 3;
const supplies_consumed = 6;
const default_crew_supplies = 2;
const bar_scale = 14;

type ShiftResults = {
  crewAssignedSupplies: number;
  crewSize: number;
  production: number;
  consumption: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let crewSupplies = default_crew_supplies;

function calcProduction(crewCount: number): number {
  return crewCount * supplies_per_crew_member;
}

function formatBalance(balance: number): string {
  return `${balance > 0 ? "+" : ""}${balance}`;
}

function calculateShiftResults(crewAssignedSupplies: number): ShiftResults {
  const production = calcProduction(crewAssignedSupplies);
  const consumption = supplies_consumed;
  const balance = production - consumption;
  return {
    crewAssignedSupplies: crewAssignedSupplies,
    crewSize: crew_size,
    production: production,
    consumption: consumption,
    balance: balance,
  };
}

function drawCrewRoster(crewAssignedSupplies: number) {
  for (let indexCrew = 0; indexCrew < crew_size; indexCrew++) {
    ctx.fillStyle = indexCrew < crewAssignedSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + indexCrew * 45, 16, 36, 36);
    ctx.fillStyle = indexCrew < crewAssignedSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(indexCrew + 1), 31 + indexCrew * 45, 40);
  }
}

function redraw() {
  const results = calculateShiftResults(crewSupplies);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewRoster(results.crewAssignedSupplies);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${results.crewAssignedSupplies} / ${results.crewSize}`,
    18,
    76,
  );
  ctx.fillText(`Production: ${results.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.production * bar_scale, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumption * bar_scale, 20);
  readout.textContent =
    `Assigned: ${results.crewAssignedSupplies}/${results.crewSize} · Production: ${results.production} · Consumption: ${results.consumption} · Balance: ${
      formatBalance(results.balance)
    }`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  crewSupplies = Math.max(0, crewSupplies - 1);
  redraw();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  crewSupplies = Math.min(crew_size, crewSupplies + 1);
  redraw();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    crewSupplies = default_crew_supplies;
    redraw();
  };
redraw();
