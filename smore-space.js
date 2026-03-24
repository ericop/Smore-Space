// S'more Space: electronic board game
// by EricOP

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const MAX_PLAYERS = 5;
const MAX_NAME_LENGTH = 24;
const GRID_COLS = 16;
const GRID_ROWS = 8;
const GRID_SIZE = 32;
const GRID_X = 224;
const GRID_Y = 196;
const GRID_WIDTH = GRID_COLS * GRID_SIZE;
const GRID_HEIGHT = GRID_ROWS * GRID_SIZE;
const STARTING_CASH = 10;
const MARKET_REFILL_THRESHOLD = 5;
const NAVY = "#183153";
const NAVY_DARK = "#10233f";
const CREAM = "#f5e7c2";
const WOOD = "#7a5632";

const BASE_SQUARE_TYPES = [
  "test",
  "rv",
  "rustic",
  "cabin",
  "bathroom",
  "shower",
  "camp_store"
];

const ADVANCED_SQUARE_TYPES = [
  "tent_electric",
  "playground",
  "water_station",
  "septic_dump",
  "ice_cream_addon",
  "firewood_addon",
  "boat_ramp_dock",
  "parking",
  "education_pavilion",
  "activities_pavilion",
  "beach",
  "forest_path",
  "field_sports"
];

const BASE_TYPE_LABELS = {
  test: "Test",
  rv: "RV",
  rustic: "Rustic",
  cabin: "Cabin",
  bathroom: "Bath",
  shower: "Shower",
  camp_store: "Store"
};

const TYPE_COLORS = {
  test: "#9ad2ff",
  rv: "#6ed39f",
  rustic: "#d8b27c",
  cabin: "#f39b63",
  bathroom: "#c88dff",
  shower: "#7be0e6",
  camp_store: "#ffdb6e"
};

const DOMINO_SHAPES = [
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]]
];

const COMPLEX_SHAPES = [
  [[0, 0]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [1, 0], [0, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[1, 0], [0, 1], [1, 1], [1, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [2, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
  [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]],
  [[0, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  [[1, 0], [0, 1], [1, 1], [2, 1], [0, 2]]
];

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute("aria-label", "S'more Space game canvas");
document.body.appendChild(canvas);

const state = {
  screen: "menu",
  players: [""],
  playerStates: [],
  sharedMarket: createPieceMarket(),
  launchedPlayers: [],
  statusMessage: "",
  activePlayerIndex: 0,
  activeInputIndex: 0,
  selectedPiece: null,
  pendingPlacement: null,
  passOverlay: null,
  passConfirmOverlay: false,
  exitOverlay: false,
  roundNumber: 1,
  uiButtons: [],
  inputBoxes: [],
  pieceSlots: [],
  pointer: { x: -1000, y: -1000 },
  time: 0
};

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
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

function createPiece(groupName, slotIndex) {
  const cells = groupName === "dominoes"
    ? DOMINO_SHAPES[slotIndex % DOMINO_SHAPES.length]
    : COMPLEX_SHAPES[Math.floor(Math.random() * COMPLEX_SHAPES.length)];
  const squareType = randomFrom(BASE_SQUARE_TYPES);

  return {
    id: `${groupName}-${Date.now()}-${slotIndex}-${Math.random().toString(16).slice(2, 8)}`,
    size: cells.length,
    squareType,
    cells
  };
}

function createPieceMarket() {
  return {
    dominoes: Array.from({ length: 6 }, (_, index) => createPiece("dominoes", index)),
    complex: Array.from({ length: 4 }, (_, index) => createPiece("complex", index))
  };
}

function createPlayerState(name) {
  return {
    name,
    cash: STARTING_CASH,
    passedThisRound: false,
    grid: Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLS }, () => null))
  };
}

function resetGameForPlayers(names) {
  state.launchedPlayers = names;
  state.playerStates = names.map((name) => createPlayerState(name));
  state.sharedMarket = createPieceMarket();
  state.activePlayerIndex = 0;
  state.selectedPiece = null;
  state.pendingPlacement = null;
  state.passOverlay = null;
  state.passConfirmOverlay = false;
  state.exitOverlay = false;
  state.roundNumber = 1;
  state.statusMessage = `${names[0]}'s turn. Pick from the shared market.`;
  state.screen = "game";
}

function registerButton(button) {
  const hovered = pointInRect(state.pointer.x, state.pointer.y, button);
  state.uiButtons.push({ ...button, hovered });

  const fill = button.disabled
    ? "rgba(24, 49, 83, 0.28)"
    : button.variant === "danger"
      ? hovered ? "#ff8f8f" : "#ff6f6f"
      : button.variant === "success"
        ? hovered ? "#7ad57f" : "#63c96a"
    : button.variant === "secondary"
      ? hovered ? "#21456f" : NAVY_DARK
      : hovered ? "#1f4a7a" : NAVY;
  const stroke = button.variant === "secondary"
    ? "#6f8fb8"
    : button.variant === "danger"
      ? "#b83d3d"
      : button.variant === "success"
        ? "#9ec7f3"
        : "#9ec7f3";
  const textColor = button.variant === "danger" ? "#fff7eb" : CREAM;

  drawRoundedRect(button.x, button.y, button.w, button.h, 20, fill, stroke, 2);
  drawText(button.label, button.x + button.w / 2, button.y + button.h / 2, {
    font: "700 20px 'Trebuchet MS', sans-serif",
    color: textColor,
    align: "center",
    baseline: "middle"
  });
}

function drawInputBox(index, x, y, w, h) {
  const active = state.activeInputIndex === index;
  const hovered = pointInRect(state.pointer.x, state.pointer.y, { x, y, w, h });
  const border = active ? NAVY : hovered ? "#496c97" : "rgba(24, 49, 83, 0.28)";
  const fill = active ? "rgba(24, 49, 83, 0.08)" : "rgba(255, 248, 231, 0.5)";
  const name = state.players[index] || "";
  const showCaret = active && Math.floor(state.time * 1.8) % 2 === 0;
  const displayName = name || `Player ${index + 1} name`;
  const displayColor = name ? NAVY_DARK : "rgba(24, 49, 83, 0.5)";

  state.inputBoxes.push({ x, y, w, h, index });

  drawRoundedRect(x, y, w, h, 18, fill, border, active ? 3 : 2);
  drawText(`Player ${index + 1}`, x, y - 10, {
    font: "700 18px 'Trebuchet MS', sans-serif",
    color: NAVY
  });
  drawText(displayName, x + 16, y + h / 2, {
    font: "22px 'Trebuchet MS', sans-serif",
    color: displayColor,
    baseline: "middle"
  });

  if (active && showCaret) {
    ctx.save();
    ctx.font = "22px 'Trebuchet MS', sans-serif";
    ctx.strokeStyle = NAVY;
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
  state.activeInputIndex = state.players.length - 1;
  state.statusMessage = "";
}

function removePlayer(index) {
  if (state.players.length === 1) {
    state.players[0] = "";
    state.activeInputIndex = 0;
    state.statusMessage = "At least one player slot stays on screen.";
    return;
  }

  state.players.splice(index, 1);
  state.activeInputIndex = Math.max(0, Math.min(state.activeInputIndex, state.players.length - 1));
  state.statusMessage = "";
}

function startGameFromSetup() {
  const trimmedPlayers = state.players.map((name) => name.trim()).filter(Boolean);

  if (trimmedPlayers.length < 2) {
    state.statusMessage = "Add at least 2 player names to start.";
    return;
  }

  resetGameForPlayers(trimmedPlayers);
}

function getCurrentPlayerState() {
  return state.playerStates[state.activePlayerIndex];
}

function getEnteredPlayerCount() {
  return state.players.map((name) => name.trim()).filter(Boolean).length;
}

function getPieceCost(piece) {
  return piece.cells.length;
}

function refillEmptyMarketSlots() {
  ["dominoes", "complex"].forEach((groupName) => {
    state.sharedMarket[groupName] = state.sharedMarket[groupName].map((piece, slotIndex) =>
      piece || createPiece(groupName, slotIndex)
    );
  });
}

function countTakenMarketSlots() {
  return [...state.sharedMarket.dominoes, ...state.sharedMarket.complex].filter((piece) => !piece).length;
}

function maybeRefillMarket() {
  if (countTakenMarketSlots() < MARKET_REFILL_THRESHOLD) {
    return false;
  }

  refillEmptyMarketSlots();
  return true;
}

function allPlayersPassed() {
  return state.playerStates.length > 0 && state.playerStates.every((player) => player.passedThisRound);
}

function getNextActivePlayerIndex(startIndex) {
  for (let offset = 1; offset <= state.playerStates.length; offset += 1) {
    const index = (startIndex + offset) % state.playerStates.length;
    if (!state.playerStates[index].passedThisRound) {
      return index;
    }
  }

  return startIndex;
}

function startNextRound() {
  state.roundNumber += 1;
  state.playerStates.forEach((player) => {
    player.passedThisRound = false;
  });
  maybeRefillMarket();
  state.activePlayerIndex = 0;
  state.passOverlay = {
    nextPlayerName: state.playerStates[0].name,
    message: `Round ${state.roundNumber} begins. ${state.playerStates[0].name} goes first.`
  };
  state.statusMessage = state.passOverlay.message;
}

function advanceTurn() {
  if (state.playerStates.length === 0) {
    return;
  }

  if (allPlayersPassed()) {
    startNextRound();
    return;
  }

  state.activePlayerIndex = getNextActivePlayerIndex(state.activePlayerIndex);
  const nextPlayerName = state.playerStates[state.activePlayerIndex].name;
  const refilledMarket = maybeRefillMarket();
  let nextMessage = `${nextPlayerName}'s turn. Choose from the remaining pieces.`;

  if (refilledMarket) {
    nextMessage = `${nextPlayerName}'s turn. The draw pile refilled after half the pieces were taken.`;
  }

  state.statusMessage = nextMessage;
  state.passOverlay = {
    nextPlayerName,
    message: nextMessage
  };
}

function confirmPassForRound() {
  const player = getCurrentPlayerState();
  if (!player) {
    return;
  }

  player.passedThisRound = true;
  state.passConfirmOverlay = false;
  state.selectedPiece = null;
  state.pendingPlacement = null;
  state.statusMessage = `${player.name} is done building for round ${state.roundNumber}.`;
  advanceTurn();
}

function canPlacePiece(player, piece, startCol, startRow) {
  for (const [dx, dy] of piece.cells) {
    const col = startCol + dx;
    const row = startRow + dy;

    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
      return false;
    }

    if (player.grid[row][col]) {
      return false;
    }
  }

  return true;
}

function canMovePendingPlacement(dx, dy) {
  const player = getCurrentPlayerState();
  if (!player || !state.pendingPlacement) {
    return false;
  }

  return canPlacePiece(
    player,
    state.pendingPlacement.piece,
    state.pendingPlacement.col + dx,
    state.pendingPlacement.row + dy
  );
}

function movePendingPlacement(dx, dy) {
  if (!state.pendingPlacement || !canMovePendingPlacement(dx, dy)) {
    return;
  }

  state.pendingPlacement.col += dx;
  state.pendingPlacement.row += dy;
  state.statusMessage = "Adjust the preview, then confirm or cancel.";
}

function rotateCells(cells, direction) {
  const rotated = cells.map(([x, y]) =>
    direction === "right" ? [y, -x] : [-y, x]
  );
  const minX = Math.min(...rotated.map(([x]) => x));
  const minY = Math.min(...rotated.map(([, y]) => y));

  return rotated.map(([x, y]) => [x - minX, y - minY]);
}

function rotatePendingPlacement(direction) {
  const player = getCurrentPlayerState();
  if (!player || !state.pendingPlacement) {
    return;
  }

  const rotatedCells = rotateCells(state.pendingPlacement.piece.cells, direction);
  const rotatedPiece = {
    ...state.pendingPlacement.piece,
    cells: rotatedCells
  };

  if (!canPlacePiece(player, rotatedPiece, state.pendingPlacement.col, state.pendingPlacement.row)) {
    state.statusMessage = "That rotation does not fit there.";
    return;
  }

  state.pendingPlacement.piece = rotatedPiece;
  if (state.selectedPiece) {
    state.selectedPiece.piece = rotatedPiece;
  }
  state.statusMessage = "Rotation ready. Confirm or keep adjusting.";
}

function flipCellsHorizontally(cells) {
  const maxX = Math.max(...cells.map(([x]) => x));
  return cells.map(([x, y]) => [maxX - x, y]);
}

function flipPendingPlacement() {
  const player = getCurrentPlayerState();
  if (!player || !state.pendingPlacement) {
    return;
  }

  const flippedCells = flipCellsHorizontally(state.pendingPlacement.piece.cells);
  const flippedPiece = {
    ...state.pendingPlacement.piece,
    cells: flippedCells
  };

  if (!canPlacePiece(player, flippedPiece, state.pendingPlacement.col, state.pendingPlacement.row)) {
    state.statusMessage = "That flip does not fit there.";
    return;
  }

  state.pendingPlacement.piece = flippedPiece;
  if (state.selectedPiece) {
    state.selectedPiece.piece = flippedPiece;
  }
  state.statusMessage = "Flip ready. Confirm or keep adjusting.";
}

function placeSelectedPieceAt(point) {
  const player = getCurrentPlayerState();
  if (!player || !state.selectedPiece) {
    return;
  }

  if (!pointInRect(point.x, point.y, { x: GRID_X, y: GRID_Y, w: GRID_WIDTH, h: GRID_HEIGHT })) {
    return;
  }

  const col = Math.floor((point.x - GRID_X) / GRID_SIZE);
  const row = Math.floor((point.y - GRID_Y) / GRID_SIZE);
  const piece = state.selectedPiece.piece;
  const cost = getPieceCost(piece);

  if (player.cash < cost) {
    state.statusMessage = "Not enough money for that piece.";
    state.pendingPlacement = null;
    return;
  }

  if (!canPlacePiece(player, piece, col, row)) {
    state.statusMessage = "That piece does not fit there.";
    state.pendingPlacement = null;
    return;
  }

  state.pendingPlacement = {
    col,
    row,
    pieceId: piece.id,
    piece,
    groupName: state.selectedPiece.groupName,
    slotIndex: state.selectedPiece.slotIndex
  };
  state.statusMessage = "Use the green check to confirm or the red X to cancel.";
}

function confirmPendingPlacement() {
  const player = getCurrentPlayerState();
  if (!player || !state.pendingPlacement || !state.selectedPiece) {
    return;
  }

  const { col, row, piece } = state.pendingPlacement;
  const cost = getPieceCost(piece);

  if (player.cash < cost) {
    state.statusMessage = "Not enough money for that piece.";
    state.pendingPlacement = null;
    return;
  }

  if (!canPlacePiece(player, piece, col, row)) {
    state.statusMessage = "That piece does not fit there.";
    state.pendingPlacement = null;
    return;
  }

  piece.cells.forEach(([dx, dy]) => {
    player.grid[row + dy][col + dx] = piece.squareType;
  });
  player.cash -= cost;
  state.sharedMarket[state.selectedPiece.groupName][state.selectedPiece.slotIndex] = null;
  state.selectedPiece = null;
  state.pendingPlacement = null;
  advanceTurn();
}

function cancelPendingPlacement() {
  if (!state.pendingPlacement) {
    return;
  }

  state.pendingPlacement = null;
  state.statusMessage = "Placement canceled. Piece returned to the draw pile.";
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  sky.addColorStop(0, "#f6d38c");
  sky.addColorStop(1, "#d0b075");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const glow = ctx.createRadialGradient(CANVAS_WIDTH / 2, 90, 40, CANVAS_WIDTH / 2, 90, 320);
  glow.addColorStop(0, "rgba(250, 237, 198, 0.35)");
  glow.addColorStop(1, "rgba(250, 237, 198, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = "#7ca15a";
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

  ctx.fillStyle = "#5f8446";
  ctx.fillRect(0, 430, CANVAS_WIDTH, 110);

  ctx.fillStyle = "#7a5632";
  ctx.fillRect(140, 365, 100, 10);
  ctx.fillRect(155, 375, 8, 28);
  ctx.fillRect(217, 375, 8, 28);
  ctx.fillRect(130, 392, 120, 8);
  ctx.fillRect(145, 400, 8, 24);
  ctx.fillRect(227, 400, 8, 24);

  ctx.fillRect(705, 358, 100, 10);
  ctx.fillRect(720, 368, 8, 28);
  ctx.fillRect(782, 368, 8, 28);
  ctx.fillRect(695, 385, 120, 8);
  ctx.fillRect(710, 393, 8, 24);
  ctx.fillRect(792, 393, 8, 24);

  ctx.fillStyle = "#7d6752";
  ctx.beginPath();
  ctx.arc(480, 410, 30, 0, Math.PI * 2);
  ctx.fill();

  const flamePulse = 0.75 + 0.25 * Math.sin(state.time * 5);
  ctx.fillStyle = `rgba(255, 120, 30, ${0.75 + flamePulse * 0.2})`;
  ctx.beginPath();
  ctx.moveTo(480, 385);
  ctx.quadraticCurveTo(494, 365, 486, 342);
  ctx.quadraticCurveTo(502, 360, 495, 387);
  ctx.quadraticCurveTo(490, 402, 480, 385);
  ctx.fill();
  ctx.fillStyle = `rgba(255, 210, 70, ${0.65 + flamePulse * 0.2})`;
  ctx.beginPath();
  ctx.moveTo(478, 387);
  ctx.quadraticCurveTo(488, 372, 483, 356);
  ctx.quadraticCurveTo(494, 370, 489, 388);
  ctx.quadraticCurveTo(485, 398, 478, 387);
  ctx.fill();

  ctx.fillStyle = "#e2cf9d";
  ctx.beginPath();
  ctx.moveTo(50, 424);
  ctx.lineTo(94, 360);
  ctx.lineTo(138, 424);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#21456f";
  ctx.beginPath();
  ctx.moveTo(94, 360);
  ctx.lineTo(118, 395);
  ctx.lineTo(70, 395);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f4e7cf";
  ctx.fillRect(89, 394, 10, 30);
}

function drawPanel() {
  drawRoundedRect(130, 54, 700, 432, 30, WOOD, CREAM, 4);
  drawRoundedRect(150, 74, 660, 392, 24, "#f4e2b6", "rgba(24, 49, 83, 0.22)", 2);
}

function drawMenuScreen() {
  drawPanel();
  drawText("S'more Space", CANVAS_WIDTH / 2, 176, {
    font: "700 58px Georgia, serif",
    color: NAVY,
    align: "center",
    shadow: true
  });
  drawWrappedText(
    "Gather your friends, a few marshmallows, and lets see who can imagine and plan the greatest camping park",
    CANVAS_WIDTH / 2,
    220,
    470,
    32,
    {
      font: "24px Georgia, serif",
      color: NAVY_DARK,
      align: "center"
    }
  );

  registerButton({
    x: 330,
    y: 314,
    w: 190,
    h: 56,
    label: "Play Game",
    action: "play",
    variant: "primary"
  });

  registerButton({
    x: 536,
    y: 314,
    w: 190,
    h: 56,
    label: "Play test",
    action: "play-test",
    variant: "secondary"
  });

  registerButton({
    x: 330,
    y: 388,
    w: 190,
    h: 56,
    label: "How To Play",
    action: "how-to-play",
    variant: "secondary"
  });

  registerButton({
    x: 536,
    y: 388,
    w: 190,
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
    color: NAVY,
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
      color: NAVY_DARK,
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

function drawHowToPlayScreen() {
  drawPanel();
  drawText("How To Play", CANVAS_WIDTH / 2, 144, {
    font: "700 42px 'Trebuchet MS', sans-serif",
    color: NAVY,
    align: "center"
  });
  drawWrappedText(
    "Pick from the shared trays, place it on your board, then the next player chooses from what is left.",
    CANVAS_WIDTH / 2,
    220,
    520,
    34,
    {
      font: "26px 'Trebuchet MS', sans-serif",
      color: NAVY_DARK,
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
    color: NAVY,
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
      color: NAVY_DARK,
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
    color: NAVY_DARK,
    align: "center"
  });

  if (state.statusMessage) {
    drawText(state.statusMessage, CANVAS_WIDTH / 2, 456, {
      font: "20px 'Trebuchet MS', sans-serif",
      color: NAVY,
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
    variant: "primary",
    disabled: getEnteredPlayerCount() < 2
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

function drawPieceCard(piece, x, y, w, h, groupName, slotIndex) {
  if (!piece) {
    drawRoundedRect(x, y, w, h, 16, "rgba(255, 255, 255, 0.04)", "rgba(255, 255, 255, 0.1)", 1);
    drawText("Taken", x + w / 2, y + h / 2, {
      font: "700 16px 'Trebuchet MS', sans-serif",
      color: "rgba(255, 247, 235, 0.55)",
      align: "center",
      baseline: "middle"
    });
    return;
  }

  const selected =
    state.selectedPiece &&
    state.selectedPiece.groupName === groupName &&
    state.selectedPiece.slotIndex === slotIndex;
  const hovered = pointInRect(state.pointer.x, state.pointer.y, { x, y, w, h });

  state.pieceSlots.push({ x, y, w, h, piece, groupName, slotIndex });

  drawRoundedRect(
    x,
    y,
    w,
    h,
    16,
    selected ? "rgba(255, 179, 71, 0.24)" : "rgba(255, 255, 255, 0.08)",
    selected ? "#ffb347" : hovered ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.18)",
    selected ? 3 : 2
  );

  drawText(BASE_TYPE_LABELS[piece.squareType], x + 12, y + 18, {
    font: "700 16px 'Trebuchet MS', sans-serif",
    color: "#fff7eb"
  });
  drawText(`$${getPieceCost(piece)}`, x + w - 12, y + 18, {
    font: "700 16px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "right"
  });

  const cellSize = piece.size === 2 ? 24 : 18;
  const previewWidth = (Math.max(...piece.cells.map(([dx]) => dx)) + 1) * cellSize;
  const previewHeight = (Math.max(...piece.cells.map(([, dy]) => dy)) + 1) * cellSize;
  const startX = x + (w - previewWidth) / 2;
  const startY = y + 30 + (h - 40 - previewHeight) / 2;
  const color = TYPE_COLORS[piece.squareType] || "#9ad2ff";

  piece.cells.forEach(([dx, dy]) => {
    drawRoundedRect(
      startX + dx * cellSize,
      startY + dy * cellSize,
      cellSize - 2,
      cellSize - 2,
      6,
      color,
      "rgba(14, 18, 40, 0.5)",
      1
    );
  });
}

function drawPlacedCell(squareType, x, y, size) {
  drawRoundedRect(
    x + 2,
    y + 2,
    size - 4,
    size - 4,
    6,
    TYPE_COLORS[squareType] || "#9ad2ff",
    "rgba(14, 18, 40, 0.5)",
    1
  );
  drawText(BASE_TYPE_LABELS[squareType] || squareType, x + size / 2, y + size / 2 + 1, {
    font: "700 10px 'Trebuchet MS', sans-serif",
    color: "#13203e",
    align: "center",
    baseline: "middle"
  });
}

function drawPendingPlacement() {
  if (!state.pendingPlacement) {
    return;
  }

  const { piece, col, row } = state.pendingPlacement;
  const pulse = 0.45 + 0.25 * Math.sin(state.time * 5);
  const color = TYPE_COLORS[piece.squareType] || "#9ad2ff";
  let minX = GRID_X + (col + piece.cells[0][0]) * GRID_SIZE;
  let minY = GRID_Y + (row + piece.cells[0][1]) * GRID_SIZE;
  let maxX = minX + GRID_SIZE;
  let maxY = minY + GRID_SIZE;

  piece.cells.forEach(([dx, dy]) => {
    const cellX = GRID_X + (col + dx) * GRID_SIZE;
    const cellY = GRID_Y + (row + dy) * GRID_SIZE;
    minX = Math.min(minX, cellX);
    minY = Math.min(minY, cellY);
    maxX = Math.max(maxX, cellX + GRID_SIZE);
    maxY = Math.max(maxY, cellY + GRID_SIZE);

    drawRoundedRect(
      cellX + 2,
      cellY + 2,
      GRID_SIZE - 4,
      GRID_SIZE - 4,
      6,
      `${color}cc`,
      `rgba(255, 240, 190, ${pulse})`,
      3
    );
  });

  const tooltipWidth = 188;
  const tooltipHeight = 138;
  const tooltipX = Math.min(maxX + 10, CANVAS_WIDTH - tooltipWidth - 14);
  const tooltipY = Math.max(92, minY - 18);

  drawRoundedRect(
    tooltipX,
    tooltipY,
    tooltipWidth,
    tooltipHeight,
    18,
    "rgba(15, 20, 44, 0.96)",
    `rgba(255, 216, 155, ${pulse + 0.15})`,
    2
  );

  drawText("Move", tooltipX + 16, tooltipY + 20, {
    font: "700 15px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });

  registerButton({
    x: tooltipX + 68,
    y: tooltipY + 8,
    w: 52,
    h: 30,
    label: "Up",
    action: "move-up",
    variant: "secondary",
    disabled: !canMovePendingPlacement(0, -1)
  });

  registerButton({
    x: tooltipX + 12,
    y: tooltipY + 42,
    w: 52,
    h: 30,
    label: "Left",
    action: "move-left",
    variant: "secondary",
    disabled: !canMovePendingPlacement(-1, 0)
  });

  registerButton({
    x: tooltipX + 68,
    y: tooltipY + 42,
    w: 52,
    h: 30,
    label: "Dn",
    action: "move-down",
    variant: "secondary",
    disabled: !canMovePendingPlacement(0, 1)
  });

  registerButton({
    x: tooltipX + 124,
    y: tooltipY + 42,
    w: 52,
    h: 30,
    label: "Right",
    action: "move-right",
    variant: "secondary",
    disabled: !canMovePendingPlacement(1, 0)
  });

  drawText("Rotate", tooltipX + 16, tooltipY + 89, {
    font: "700 15px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });

  registerButton({
    x: tooltipX + 68,
    y: tooltipY + 78,
    w: 52,
    h: 30,
    label: "⟲",
    action: "rotate-left",
    variant: "secondary"
  });

  registerButton({
    x: tooltipX + 124,
    y: tooltipY + 78,
    w: 52,
    h: 30,
    label: "⟳",
    action: "rotate-right",
    variant: "secondary"
  });

  registerButton({
    x: tooltipX + 12,
    y: tooltipY + 108,
    w: 52,
    h: 24,
    label: "⇋",
    action: "flip-piece",
    variant: "secondary"
  });

  registerButton({
    x: tooltipX + 68,
    y: tooltipY + 108,
    w: 52,
    h: 24,
    label: "OK",
    action: "confirm-placement",
    variant: "success"
  });

  registerButton({
    x: tooltipX + 124,
    y: tooltipY + 108,
    w: 52,
    h: 24,
    label: "X",
    action: "cancel-placement",
    variant: "danger"
  });
}

function drawGrid(player) {
  drawRoundedRect(GRID_X - 16, GRID_Y - 36, GRID_WIDTH + 32, GRID_HEIGHT + 52, 22, "rgba(15, 20, 44, 0.88)", "rgba(255, 216, 155, 0.3)", 2);
  drawText(`${player.name}'s Campground`, GRID_X, GRID_Y - 12, {
    font: "700 22px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const cellX = GRID_X + col * GRID_SIZE;
      const cellY = GRID_Y + row * GRID_SIZE;
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.fillRect(cellX, cellY, GRID_SIZE - 1, GRID_SIZE - 1);

      const squareType = player.grid[row][col];
      if (squareType) {
        drawPlacedCell(squareType, cellX, cellY, GRID_SIZE);
      }
    }
  }

  drawPendingPlacement();

  drawText("Water", GRID_X + GRID_WIDTH / 2, GRID_Y - 42, {
    font: "700 14px 'Trebuchet MS', sans-serif",
    color: "#8dd5ff",
    align: "center"
  });
  drawText("Woods", GRID_X - 64, GRID_Y + GRID_HEIGHT / 2, {
    font: "700 14px 'Trebuchet MS', sans-serif",
    color: "#9cd39d",
    align: "center",
    baseline: "middle"
  });
  drawText("Field", GRID_X + GRID_WIDTH + 56, GRID_Y + GRID_HEIGHT / 2, {
    font: "700 14px 'Trebuchet MS', sans-serif",
    color: "#f0d28a",
    align: "center",
    baseline: "middle"
  });
  drawText("Road", GRID_X + GRID_WIDTH / 2, GRID_Y + GRID_HEIGHT + 26, {
    font: "700 14px 'Trebuchet MS', sans-serif",
    color: "#f6b07b",
    align: "center"
  });
}

function drawPieceTrays() {
  drawText("2x1 Pieces", 50, 56, {
    font: "700 22px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });

  state.sharedMarket.dominoes.forEach((piece, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    drawPieceCard(piece, 36 + col * 56, 72 + row * 124, 48, 108, "dominoes", index);
  });

  drawText("Complex Pieces", 748, 56, {
    font: "700 22px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });

  state.sharedMarket.complex.forEach((piece, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    drawPieceCard(piece, 744 + col * 92, 72 + row * 124, 84, 108, "complex", index);
  });
}

function drawGameHud(player) {
  drawRoundedRect(224, 18, 512, 70, 20, "rgba(15, 20, 44, 0.84)", "rgba(255, 216, 155, 0.25)", 2);
  drawText(`Player: ${player.name}`, 246, 48, {
    font: "700 24px 'Trebuchet MS', sans-serif",
    color: "#fff7eb"
  });
  drawText(`Round: ${state.roundNumber}`, 246, 24, {
    font: "700 16px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });
  drawText(`Cash: $${player.cash}`, 246, 74, {
    font: "700 20px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9"
  });

  const selectedText = state.selectedPiece
    ? `Selected: ${BASE_TYPE_LABELS[state.selectedPiece.piece.squareType]} ($${getPieceCost(state.selectedPiece.piece)})`
    : "Selected: none";

  drawText(selectedText, 500, 48, {
    font: "20px 'Trebuchet MS', sans-serif",
    color: "#d8cee0"
  });
}

function drawGameScreen() {
  const player = getCurrentPlayerState();
  if (!player) {
    return;
  }

  drawPieceTrays();
  drawGameHud(player);
  drawGrid(player);

  drawRoundedRect(224, 468, 512, 50, 18, "rgba(15, 20, 44, 0.84)", "rgba(255, 216, 155, 0.24)", 2);
  drawText(state.statusMessage || "Base square types are live now. Advanced square types are stored for later.", 240, 498, {
    font: "18px 'Trebuchet MS', sans-serif",
    color: "#fff7eb",
    baseline: "middle"
  });

  registerButton({
    x: 744,
    y: 468,
    w: 160,
    h: 50,
    label: "Main Menu",
    action: "menu",
    variant: "secondary"
  });

  registerButton({
    x: 744,
    y: 410,
    w: 160,
    h: 46,
    label: player.passedThisRound ? "Passed" : "Pass",
    action: "pass-round",
    variant: "secondary",
    disabled: player.passedThisRound
  });

  if (state.passOverlay) {
    drawPassOverlay();
  }

  if (state.passConfirmOverlay) {
    drawPassConfirmOverlay();
  }

  if (state.exitOverlay) {
    drawExitOverlay();
  }
}

function drawPassOverlay() {
  ctx.fillStyle = "rgba(6, 9, 20, 0.72)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRoundedRect(220, 150, 520, 210, 24, "rgba(15, 20, 44, 0.96)", "rgba(255, 216, 155, 0.35)", 3);
  drawText("Pass And Play", CANVAS_WIDTH / 2, 194, {
    font: "700 34px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    `Please pass to ${state.passOverlay.nextPlayerName}.`,
    CANVAS_WIDTH / 2,
    230,
    380,
    34,
    {
      font: "28px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );

  registerButton({
    x: 390,
    y: 300,
    w: 180,
    h: 44,
    label: "OK",
    action: "close-pass-overlay",
    variant: "primary"
  });
}

function drawExitOverlay() {
  ctx.fillStyle = "rgba(6, 9, 20, 0.72)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRoundedRect(220, 146, 520, 220, 24, "rgba(15, 20, 44, 0.96)", "rgba(255, 216, 155, 0.35)", 3);
  drawText("Leave Game?", CANVAS_WIDTH / 2, 206, {
    font: "700 34px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    "Are you sure you want to exit your game?",
    CANVAS_WIDTH / 2,
    242,
    390,
    38,
    {
      font: "26px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );

  registerButton({
    x: 286,
    y: 314,
    w: 160,
    h: 44,
    label: "Stay",
    action: "close-exit-overlay",
    variant: "secondary"
  });

  registerButton({
    x: 514,
    y: 314,
    w: 160,
    h: 44,
    label: "Exit",
    action: "confirm-exit-game",
    variant: "danger"
  });
}

function drawPassConfirmOverlay() {
  const player = getCurrentPlayerState();
  if (!player) {
    return;
  }

  ctx.fillStyle = "rgba(6, 9, 20, 0.72)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRoundedRect(220, 146, 520, 220, 24, "rgba(15, 20, 44, 0.96)", "rgba(255, 216, 155, 0.35)", 3);
  drawText("Pass This Round?", CANVAS_WIDTH / 2, 206, {
    font: "700 34px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    `Are you sure ${player.name} is done building for round ${state.roundNumber}?`,
    CANVAS_WIDTH / 2,
    242,
    390,
    38,
    {
      font: "26px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );

  registerButton({
    x: 286,
    y: 314,
    w: 160,
    h: 44,
    label: "Keep Building",
    action: "close-pass-confirm",
    variant: "secondary"
  });

  registerButton({
    x: 514,
    y: 314,
    w: 160,
    h: 44,
    label: "Pass",
    action: "confirm-pass-round",
    variant: "primary"
  });
}

function draw() {
  state.uiButtons = [];
  state.inputBoxes = [];
  state.pieceSlots = [];

  drawBackground();

  if (state.screen === "credits") {
    drawCreditsScreen();
    return;
  }

  if (state.screen === "players") {
    drawPlayersScreen();
    return;
  }

  if (state.screen === "how-to-play") {
    drawHowToPlayScreen();
    return;
  }

  if (state.screen === "game") {
    drawGameScreen();
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

  if (button.action === "play-test") {
    resetGameForPlayers(["Eop", "Chris"]);
    return;
  }

  if (button.action === "credits") {
    state.screen = "credits";
    return;
  }

  if (button.action === "how-to-play") {
    state.screen = "how-to-play";
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
    startGameFromSetup();
    return;
  }

  if (button.action === "menu") {
    if (state.screen === "game") {
      state.exitOverlay = true;
      return;
    }

    state.screen = "menu";
    state.statusMessage = "";
    state.selectedPiece = null;
    state.pendingPlacement = null;
    state.passOverlay = null;
    state.passConfirmOverlay = false;
    state.exitOverlay = false;
    return;
  }

  if (button.action === "close-pass-overlay") {
    state.passOverlay = null;
    return;
  }

  if (button.action === "pass-round") {
    state.passConfirmOverlay = true;
    return;
  }

  if (button.action === "close-pass-confirm") {
    state.passConfirmOverlay = false;
    return;
  }

  if (button.action === "confirm-pass-round") {
    confirmPassForRound();
    return;
  }

  if (button.action === "close-exit-overlay") {
    state.exitOverlay = false;
    return;
  }

  if (button.action === "confirm-exit-game") {
    state.screen = "menu";
    state.statusMessage = "";
    state.selectedPiece = null;
    state.pendingPlacement = null;
    state.passOverlay = null;
    state.passConfirmOverlay = false;
    state.exitOverlay = false;
    return;
  }

  if (button.action === "rotate-left") {
    rotatePendingPlacement("left");
    return;
  }

  if (button.action === "rotate-right") {
    rotatePendingPlacement("right");
    return;
  }

  if (button.action === "flip-piece") {
    flipPendingPlacement();
    return;
  }

  if (button.action === "move-up") {
    movePendingPlacement(0, -1);
    return;
  }

  if (button.action === "move-left") {
    movePendingPlacement(-1, 0);
    return;
  }

  if (button.action === "move-down") {
    movePendingPlacement(0, 1);
    return;
  }

  if (button.action === "move-right") {
    movePendingPlacement(1, 0);
    return;
  }

  if (button.action === "confirm-placement") {
    confirmPendingPlacement();
    return;
  }

  if (button.action === "cancel-placement") {
    cancelPendingPlacement();
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
      state.activeInputIndex = clickedInput.index;
      state.statusMessage = "";
      return;
    }
  }

  const clickedButton = state.uiButtons.find((button) => pointInRect(point.x, point.y, button));
  if (clickedButton) {
    handleAction(clickedButton);
    return;
  }

  if (state.screen === "game") {
    if (state.passConfirmOverlay) {
      return;
    }

    if (state.exitOverlay) {
      return;
    }

    if (state.passOverlay) {
      return;
    }

    const clickedPiece = state.pieceSlots.find((slot) => pointInRect(point.x, point.y, slot));
    if (clickedPiece) {
      state.selectedPiece = {
        groupName: clickedPiece.groupName,
        slotIndex: clickedPiece.slotIndex,
        piece: clickedPiece.piece
      };
      state.pendingPlacement = null;
      state.statusMessage = `${getCurrentPlayerState().name} selected ${BASE_TYPE_LABELS[clickedPiece.piece.squareType]} for $${getPieceCost(clickedPiece.piece)}.`;
      return;
    }

    if (state.selectedPiece) {
      placeSelectedPieceAt(point);
      return;
    }
  }
});

window.addEventListener("keydown", (event) => {
  if (state.screen !== "players") {
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    state.activeInputIndex =
      (state.activeInputIndex + direction + state.players.length) % state.players.length;
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    if (state.activeInputIndex < state.players.length - 1) {
      state.activeInputIndex += 1;
    } else {
      startGameFromSetup();
    }
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    const current = state.players[state.activeInputIndex] || "";
    state.players[state.activeInputIndex] = current.slice(0, -1);
    return;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  const current = state.players[state.activeInputIndex] || "";
  if (current.length >= MAX_NAME_LENGTH) {
    state.statusMessage = "Player names can be up to 24 characters.";
    return;
  }

  state.players[state.activeInputIndex] = current + event.key;
  state.statusMessage = "";
});

function frame(now) {
  state.time = now / 1000;
  draw();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
