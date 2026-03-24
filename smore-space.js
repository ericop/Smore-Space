// S'more Space: electronic board game
// by EricOP

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const MAX_PLAYERS = 5;
const MAX_NAME_LENGTH = 24;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute("aria-label", "S'more Space game canvas");
document.body.appendChild(canvas);

const state = {
  screen: "menu",
  players: [""],
  launchedPlayers: [],
  statusMessage: "",
  activePlayerIndex: 0,
  uiButtons: [],
  inputBoxes: [],
  pointer: { x: -1000, y: -1000 },
  time: 0
};

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function drawRoundedRect(x, y, w, h, radius, fillStyle, strokeStyle, lineWidth = 2) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawText(text, x, y, options = {}) {
  const {
    font = "24px 'Trebuchet MS', sans-serif",
    color = "#fff7eb",
    align = "left",
    baseline = "alphabetic",
    shadow = false
  } = options;

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  if (shadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 3;
  }

  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawWrappedText(text, x, y, maxWidth, lineHeight, options = {}) {
  ctx.save();
  ctx.font = options.font || "22px 'Trebuchet MS', sans-serif";
  ctx.fillStyle = options.color || "#d8cee0";
  ctx.textAlign = options.align || "center";
  ctx.textBaseline = "top";

  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (let index = 0; index < words.length; index += 1) {
    const testLine = line ? `${line} ${words[index]}` : words[index];
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = words[index];
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, lineY);
  }

  ctx.restore();
}

function registerButton(button) {
  const hovered = pointInRect(state.pointer.x, state.pointer.y, button);
  state.uiButtons.push({ ...button, hovered });

  const fill = button.disabled
    ? "rgba(255, 255, 255, 0.12)"
    : button.variant === "secondary"
      ? hovered ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.1)"
      : hovered ? "#ffca72" : "#ffb347";
  const stroke = button.variant === "secondary" ? "rgba(255, 255, 255, 0.2)" : "#f47b45";
  const textColor = button.variant === "secondary" ? "#fff7eb" : "#291715";

  drawRoundedRect(button.x, button.y, button.w, button.h, 24, fill, stroke, 2);
  drawText(button.label, button.x + button.w / 2, button.y + button.h / 2, {
    font: "700 24px 'Trebuchet MS', sans-serif",
    color: textColor,
    align: "center",
    baseline: "middle"
  });
}

function drawInputBox(index, x, y, w, h) {
  const active = state.activePlayerIndex === index;
  const hovered = pointInRect(state.pointer.x, state.pointer.y, { x, y, w, h });
  const border = active ? "#ffb347" : hovered ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.22)";
  const fill = active ? "rgba(255, 179, 71, 0.12)" : "rgba(255, 255, 255, 0.08)";
  const name = state.players[index] || "";
  const showCaret = active && Math.floor(state.time * 1.8) % 2 === 0;
  const displayName = name || `Player ${index + 1} name`;
  const displayColor = name ? "#fff7eb" : "rgba(255, 247, 235, 0.45)";

  state.inputBoxes.push({ x, y, w, h, index });

  drawRoundedRect(x, y, w, h, 18, fill, border, active ? 3 : 2);
  drawText(`Player ${index + 1}`, x, y - 10, {
    font: "700 18px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });
  drawText(displayName, x + 16, y + h / 2, {
    font: "22px 'Trebuchet MS', sans-serif",
    color: displayColor,
    baseline: "middle"
  });

  if (active && showCaret) {
    ctx.save();
    ctx.font = "22px 'Trebuchet MS', sans-serif";
    ctx.strokeStyle = "#fff7eb";
    ctx.lineWidth = 2;
    const textWidth = ctx.measureText(name).width;
    const caretX = x + 18 + Math.min(textWidth, w - 42);
    ctx.beginPath();
    ctx.moveTo(caretX, y + 14);
    ctx.lineTo(caretX, y + h - 14);
    ctx.stroke();
    ctx.restore();
  }
}

function addPlayer() {
  if (state.players.length >= MAX_PLAYERS) {
    state.statusMessage = "You can add up to 5 players.";
    return;
  }

  state.players.push("");
  state.activePlayerIndex = state.players.length - 1;
  state.statusMessage = "";
}

function removePlayer(index) {
  if (state.players.length === 1) {
    state.players[0] = "";
    state.activePlayerIndex = 0;
    state.statusMessage = "At least one player slot stays on screen.";
    return;
  }

  state.players.splice(index, 1);
  state.activePlayerIndex = Math.max(0, Math.min(state.activePlayerIndex, state.players.length - 1));
  state.statusMessage = "";
}

function startGame() {
  const trimmedPlayers = state.players.map((name) => name.trim()).filter(Boolean);

  if (trimmedPlayers.length === 0) {
    state.statusMessage = "Add at least one player name to start.";
    return;
  }

  state.launchedPlayers = trimmedPlayers;
  state.statusMessage = "";
  state.screen = "launch";
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, "#1d2851");
  sky.addColorStop(1, "#0d1228");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const glow = ctx.createRadialGradient(CANVAS_WIDTH / 2, 70, 30, CANVAS_WIDTH / 2, 70, 280);
  glow.addColorStop(0, "rgba(255, 208, 138, 0.22)");
  glow.addColorStop(1, "rgba(255, 208, 138, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const starOffsets = [
    [110, 80], [190, 120], [280, 68], [414, 94], [560, 66], [690, 110], [820, 74], [880, 140],
    [120, 190], [250, 170], [360, 210], [520, 160], [630, 220], [780, 180], [860, 230]
  ];

  starOffsets.forEach(([x, y], index) => {
    const pulse = 0.55 + 0.45 * Math.sin(state.time * 1.5 + index * 0.9);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + pulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, 2 + pulse * 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#16213f";
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.lineTo(120, 370);
  ctx.lineTo(260, 410);
  ctx.lineTo(390, 350);
  ctx.lineTo(540, 402);
  ctx.lineTo(700, 330);
  ctx.lineTo(840, 405);
  ctx.lineTo(960, 360);
  ctx.lineTo(960, 540);
  ctx.lineTo(0, 540);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#0d5a4f";
  ctx.fillRect(0, 430, CANVAS_WIDTH, 110);
}

function drawPanel() {
  drawRoundedRect(130, 54, 700, 432, 30, "rgba(15, 20, 44, 0.86)", "rgba(255, 216, 155, 0.35)", 3);
}

function drawMenuScreen() {
  drawPanel();
  drawText("Campfire Game Night", CANVAS_WIDTH / 2, 112, {
    font: "700 18px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawText("S'more Space", CANVAS_WIDTH / 2, 176, {
    font: "700 62px 'Trebuchet MS', sans-serif",
    color: "#fff7eb",
    align: "center",
    shadow: true
  });
  drawWrappedText(
    "Build your crew, gather around the stars, and get ready for a cozy family game adventure.",
    CANVAS_WIDTH / 2,
    220,
    470,
    32,
    {
      font: "24px 'Trebuchet MS', sans-serif",
      color: "#d8cee0",
      align: "center"
    }
  );

  registerButton({
    x: 330,
    y: 314,
    w: 300,
    h: 56,
    label: "Play Game",
    action: "play",
    variant: "primary"
  });

  registerButton({
    x: 330,
    y: 388,
    w: 300,
    h: 56,
    label: "Credits",
    action: "credits",
    variant: "secondary"
  });
}

function drawCreditsScreen() {
  drawPanel();
  drawText("Credits", CANVAS_WIDTH / 2, 144, {
    font: "700 42px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    "This game was made by EricOP and his family, and their robot helper Codex.",
    CANVAS_WIDTH / 2,
    220,
    520,
    34,
    {
      font: "26px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );

  registerButton({
    x: 380,
    y: 390,
    w: 200,
    h: 56,
    label: "Back",
    action: "back",
    variant: "primary"
  });
}

function drawPlayersScreen() {
  drawPanel();
  drawText("Choose Players", CANVAS_WIDTH / 2, 100, {
    font: "700 42px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    "Add up to 5 players and click a name box to type right inside the canvas.",
    CANVAS_WIDTH / 2,
    140,
    540,
    30,
    {
      font: "22px 'Trebuchet MS', sans-serif",
      color: "#d8cee0",
      align: "center"
    }
  );

  const rowStartY = 202;
  const rowGap = 48;

  state.players.forEach((_, index) => {
    const rowY = rowStartY + index * rowGap;
    drawInputBox(index, 220, rowY, 360, 40);

    registerButton({
      x: 600,
      y: rowY,
      w: 140,
      h: 40,
      label: "Remove",
      action: "remove-player",
      variant: "secondary",
      playerIndex: index
    });
  });

  drawText(`${state.players.length} of ${MAX_PLAYERS} player slots used`, CANVAS_WIDTH / 2, 430, {
    font: "20px 'Trebuchet MS', sans-serif",
    color: "#d8cee0",
    align: "center"
  });

  if (state.statusMessage) {
    drawText(state.statusMessage, CANVAS_WIDTH / 2, 456, {
      font: "20px 'Trebuchet MS', sans-serif",
      color: "#ffcf91",
      align: "center"
    });
  }

  registerButton({
    x: 180,
    y: 476,
    w: 180,
    h: 40,
    label: "Add Player",
    action: "add-player",
    variant: "secondary",
    disabled: state.players.length >= MAX_PLAYERS
  });

  registerButton({
    x: 390,
    y: 476,
    w: 180,
    h: 40,
    label: "Start",
    action: "start-game",
    variant: "primary"
  });

  registerButton({
    x: 600,
    y: 476,
    w: 180,
    h: 40,
    label: "Back",
    action: "back",
    variant: "secondary"
  });
}

function drawLaunchScreen() {
  drawPanel();
  drawText("Ready To Play", CANVAS_WIDTH / 2, 128, {
    font: "700 44px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    `Player setup is complete. Your game can begin with ${state.launchedPlayers.join(", ")}.`,
    CANVAS_WIDTH / 2,
    194,
    560,
    32,
    {
      font: "24px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );
  drawRoundedRect(248, 286, 464, 72, 22, "rgba(255, 179, 71, 0.12)", "rgba(255, 179, 71, 0.28)", 2);
  drawText("More gameplay can be plugged in here next.", CANVAS_WIDTH / 2, 322, {
    font: "24px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center",
    baseline: "middle"
  });

  registerButton({
    x: 270,
    y: 396,
    w: 190,
    h: 56,
    label: "Edit Players",
    action: "edit-players",
    variant: "primary"
  });

  registerButton({
    x: 500,
    y: 396,
    w: 190,
    h: 56,
    label: "Main Menu",
    action: "menu",
    variant: "secondary"
  });
}

function draw() {
  state.uiButtons = [];
  state.inputBoxes = [];

  drawBackground();

  if (state.screen === "credits") {
    drawCreditsScreen();
    return;
  }

  if (state.screen === "players") {
    drawPlayersScreen();
    return;
  }

  if (state.screen === "launch") {
    drawLaunchScreen();
    return;
  }

  drawMenuScreen();
}

function toCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT
  };
}

function handleAction(button) {
  if (button.disabled) {
    return;
  }

  if (button.action === "play") {
    state.screen = "players";
    state.statusMessage = "";
    return;
  }

  if (button.action === "credits") {
    state.screen = "credits";
    return;
  }

  if (button.action === "back") {
    state.screen = "menu";
    state.statusMessage = "";
    return;
  }

  if (button.action === "add-player") {
    addPlayer();
    return;
  }

  if (button.action === "remove-player") {
    removePlayer(button.playerIndex);
    return;
  }

  if (button.action === "start-game") {
    startGame();
    return;
  }

  if (button.action === "edit-players") {
    state.screen = "players";
    state.statusMessage = "";
    return;
  }

  if (button.action === "menu") {
    state.screen = "menu";
    state.statusMessage = "";
  }
}

canvas.addEventListener("pointermove", (event) => {
  const point = toCanvasPoint(event);
  state.pointer.x = point.x;
  state.pointer.y = point.y;
});

canvas.addEventListener("pointerleave", () => {
  state.pointer.x = -1000;
  state.pointer.y = -1000;
});

canvas.addEventListener("pointerdown", (event) => {
  const point = toCanvasPoint(event);
  state.pointer.x = point.x;
  state.pointer.y = point.y;

  if (state.screen === "players") {
    const clickedInput = state.inputBoxes.find((inputBox) => pointInRect(point.x, point.y, inputBox));
    if (clickedInput) {
      state.activePlayerIndex = clickedInput.index;
      state.statusMessage = "";
      return;
    }
  }

  const clickedButton = state.uiButtons.find((button) => pointInRect(point.x, point.y, button));
  if (clickedButton) {
    handleAction(clickedButton);
  }
});

window.addEventListener("keydown", (event) => {
  if (state.screen !== "players") {
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    state.activePlayerIndex =
      (state.activePlayerIndex + direction + state.players.length) % state.players.length;
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    if (state.activePlayerIndex < state.players.length - 1) {
      state.activePlayerIndex += 1;
    } else {
      startGame();
    }
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    const current = state.players[state.activePlayerIndex] || "";
    state.players[state.activePlayerIndex] = current.slice(0, -1);
    return;
  }

  if (event.key === "Escape") {
    state.statusMessage = "";
    return;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const current = state.players[state.activePlayerIndex] || "";
  if (current.length >= MAX_NAME_LENGTH) {
    state.statusMessage = "Player names can be up to 24 characters.";
    return;
  }

  state.players[state.activePlayerIndex] = current + event.key;
  state.statusMessage = "";
});

function frame(now) {
  state.time = now / 1000;
  draw();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
