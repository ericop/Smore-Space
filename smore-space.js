// S'more Space: electronic board game
// by EricOP

const MAX_PLAYERS = 5;

const app = document.getElementById("app");

const state = {
  screen: "menu",
  players: [""],
  launchedPlayers: [],
  statusMessage: ""
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setScreen(nextScreen) {
  state.screen = nextScreen;
  if (nextScreen !== "players") {
    state.statusMessage = "";
  }
  render();
}

function addPlayer() {
  if (state.players.length >= MAX_PLAYERS) {
    state.statusMessage = "You can add up to 5 players.";
    render();
    return;
  }

  state.players.push("");
  state.statusMessage = "";
  render();
}

function removePlayer(index) {
  if (state.players.length === 1) {
    state.players[0] = "";
    state.statusMessage = "At least one player slot stays on screen.";
    render();
    return;
  }

  state.players.splice(index, 1);
  state.statusMessage = "";
  render();
}

function updatePlayerName(index, value) {
  state.players[index] = value;
}

function startGame() {
  const trimmedPlayers = state.players
    .map((name) => name.trim())
    .filter(Boolean);

  if (trimmedPlayers.length === 0) {
    state.statusMessage = "Add at least one player name to start.";
    render();
    return;
  }

  state.launchedPlayers = trimmedPlayers;
  state.statusMessage = "";
  state.screen = "launch";
  render();
}

function renderMenuScreen() {
  return `
    <div class="screen-shell">
      <main class="panel">
        <section class="title-art">
          <p class="eyebrow">Campfire Game Night</p>
          <h1>S'more Space</h1>
          <p class="subtitle">
            Build your crew, gather around the stars, and get ready for a cozy family game adventure.
          </p>
        </section>
        <div class="button-stack">
          <button class="primary-button" type="button" data-action="play">Play Game</button>
          <button class="secondary-button" type="button" data-action="credits">Credits</button>
        </div>
      </main>
    </div>
  `;
}

function renderCreditsScreen() {
  return `
    <div class="screen-shell">
      <main class="panel">
        <h2 class="section-title">Credits</h2>
        <p class="section-copy">
          This game was made byu EricOP and his family, and their robot helper Codex.
        </p>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="back-to-menu">Back</button>
        </div>
      </main>
    </div>
  `;
}

function renderPlayersScreen() {
  const playerRows = state.players
    .map((playerName, index) => {
      const playerNumber = index + 1;
      return `
        <div class="player-row">
          <label for="player-${playerNumber}">Player ${playerNumber}</label>
          <input
            id="player-${playerNumber}"
            type="text"
            maxlength="24"
            placeholder="Player ${playerNumber} name"
            value="${escapeHtml(playerName)}"
            data-player-input="${index}"
          >
          <button class="remove-button" type="button" data-remove-player="${index}">Remove</button>
        </div>
      `;
    })
    .join("");

  const helperText = `${state.players.length} of ${MAX_PLAYERS} player slots used`;

  return `
    <div class="screen-shell">
      <main class="panel">
        <h2 class="section-title">Choose Players</h2>
        <p class="section-copy">
          Add up to 5 players and type in each name before starting the game.
        </p>
        <section class="players-panel">
          ${playerRows}
          <p class="helper-text">${helperText}</p>
          <p class="status-text">${escapeHtml(state.statusMessage)}</p>
          <div class="button-row">
            <button
              class="secondary-button"
              type="button"
              data-action="add-player"
              ${state.players.length >= MAX_PLAYERS ? "disabled" : ""}
            >
              Add Player
            </button>
            <button class="primary-button" type="button" data-action="start-game">Start</button>
            <button class="secondary-button" type="button" data-action="back-to-menu">Back</button>
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderLaunchScreen() {
  const playerList = state.launchedPlayers
    .map((name) => `<strong>${escapeHtml(name)}</strong>`)
    .join(", ");

  return `
    <div class="screen-shell">
      <main class="panel">
        <h2 class="section-title">Ready To Play</h2>
        <p class="section-copy">
          Player setup is complete. Your game can begin with ${playerList}.
        </p>
        <div class="launch-card">
          More gameplay can be plugged in here next.
        </div>
        <div class="button-row">
          <button class="primary-button" type="button" data-action="setup-again">Edit Players</button>
          <button class="secondary-button" type="button" data-action="back-to-menu">Main Menu</button>
        </div>
      </main>
    </div>
  `;
}

function render() {
  if (!app) {
    return;
  }

  if (state.screen === "credits") {
    app.innerHTML = renderCreditsScreen();
    return;
  }

  if (state.screen === "players") {
    app.innerHTML = renderPlayersScreen();
    return;
  }

  if (state.screen === "launch") {
    app.innerHTML = renderLaunchScreen();
    return;
  }

  app.innerHTML = renderMenuScreen();
}

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;

  if (action === "play") {
    setScreen("players");
    return;
  }

  if (action === "credits") {
    setScreen("credits");
    return;
  }

  if (action === "back-to-menu") {
    setScreen("menu");
    return;
  }

  if (action === "add-player") {
    addPlayer();
    return;
  }

  if (action === "start-game") {
    startGame();
    return;
  }

  if (action === "setup-again") {
    setScreen("players");
    return;
  }

  const removeIndex = target.dataset.removePlayer;

  if (removeIndex !== undefined) {
    removePlayer(Number(removeIndex));
  }
});

document.addEventListener("input", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const playerIndex = target.dataset.playerInput;

  if (playerIndex === undefined) {
    return;
  }

  updatePlayerName(Number(playerIndex), target.value);
});

render();
