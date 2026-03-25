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
const MAX_ROUNDS = 5;
const NAVY = "#183153";
const NAVY_DARK = "#10233f";
const CREAM = "#f5e7c2";
const WOOD = "#7a5632";

const BASE_SQUARE_TYPES = [
  "tent",
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
  "education_pavilion",
  "activities_pavilion",
  "covered_common_area",
  "vending",
  "bait_gear",
  "rentals",
  "recreation_field",
  "beach",
  "forest_path",
  "field_sports"
];

const DRAWABLE_SQUARE_TYPES = [...BASE_SQUARE_TYPES, ...ADVANCED_SQUARE_TYPES];

const BASE_TYPE_LABELS = {
  test: "Rec",
  tent: "Tent",
  rv: "RV",
  rustic: "Rustic",
  cabin: "Cabin",
  bathroom: "Bath",
  shower: "Shower",
  camp_store: "Store",
  tent_electric: "E-Tent",
  playground: "Play",
  water_station: "Water",
  septic_dump: "Dump",
  ice_cream_addon: "Ice",
  firewood_addon: "Wood",
  boat_ramp_dock: "Dock",
  parking: "Park",
  education_pavilion: "Edu",
  activities_pavilion: "Event",
  covered_common_area: "Shelter",
  vending: "Vend",
  bait_gear: "Bait",
  rentals: "Rental",
  recreation_field: "Rec",
  beach: "Beach",
  forest_path: "Trail",
  field_sports: "Sports"
};

const TYPE_COLORS = {
  test: "#7fc9d6",
  tent: "#d8d27c",
  rv: "#6ed39f",
  rustic: "#d8b27c",
  cabin: "#f39b63",
  bathroom: "#c88dff",
  shower: "#7be0e6",
  camp_store: "#ffdb6e",
  tent_electric: "#8ddf97",
  playground: "#ff9b7c",
  water_station: "#79c9ff",
  septic_dump: "#8a7c64",
  ice_cream_addon: "#ffb7da",
  firewood_addon: "#b97846",
  boat_ramp_dock: "#5aa0d6",
  parking: "#9ca7b2",
  education_pavilion: "#9fbc6c",
  activities_pavilion: "#e0aa68",
  covered_common_area: "#9cb8c9",
  vending: "#e66767",
  bait_gear: "#6ba9b8",
  rentals: "#8d95d8",
  recreation_field: "#78b86e",
  beach: "#f0d28a",
  forest_path: "#6e8f55",
  field_sports: "#5db36f"
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

const ARRIVAL_PHASE_ORDER = ["early", "mid", "late"];

const ARRIVAL_PHASE_LABELS = {
  early: "Early Summer",
  mid: "Mid Summer",
  late: "Late Summer"
};

const ARRIVAL_CARD_DEFINITIONS = [
  {
    id: "early-1",
    phase: "early",
    name: "Spring Trial Campers",
    requirementsText: "Any 2 sites + 1 bathroom",
    bonusText: "+$2 if you have showers",
    noteText: "We are just here to see if we like camping...",
    baseIncome: 4,
    evaluate: (player) => {
      if (countAnySites(player) < 2 || !hasAmenity(player, "bathroom")) {
        return null;
      }
      let income = 4;
      if (hasAmenity(player, "shower")) {
        income += 2;
      }
      return buildArrivalMatch(income, ["2+ sites", "bathroom"], hasAmenity(player, "shower") ? ["showers"] : []);
    }
  },
  {
    id: "early-2",
    phase: "early",
    name: "Retired RV Pair",
    requirementsText: "1 RV site + hookups",
    bonusText: "+$3 if no tent sites adjacent",
    noteText: "-$2 if crowded near the RV",
    baseIncome: 5,
    evaluate: (player) => {
      const rvSite = findMatchingSite(player, (cell) => isSiteType(cell.type, "rv") && hasHookupsForType(cell.type));
      if (!rvSite) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      const penalties = [];
      if (!hasAdjacentSiteType(player, rvSite.row, rvSite.col, "tent")) {
        income += 3;
        bonuses.push("quiet RV pad");
      }
      if (countAdjacentOccupiedSites(player, rvSite.row, rvSite.col) > 3) {
        income -= 2;
        penalties.push("crowded");
      }
      return buildArrivalMatch(Math.max(0, income), ["RV with hookups"], bonuses, penalties);
    }
  },
  {
    id: "early-3",
    phase: "early",
    name: "Scout Troop",
    requirementsText: "3 tent sites + forest adjacency",
    bonusText: "+$4 if event space",
    noteText: "Single group, fills multiple sites",
    baseIncome: 6,
    evaluate: (player) => {
      if (countForestAdjacentSites(player, "tent") < 3) {
        return null;
      }
      let income = 6;
      const bonuses = [];
      if (hasAmenity(player, "event_space")) {
        income += 4;
        bonuses.push("event space");
      }
      return buildArrivalMatch(income, ["3 forest-adjacent tent sites"], bonuses);
    }
  },
  {
    id: "early-4",
    phase: "early",
    name: "Early Bird Fishermen",
    requirementsText: "1 tent or RV + lake access",
    bonusText: "+$3 boat ramp, +$1 bait/gear store",
    baseIncome: 5,
    evaluate: (player) => {
      if (!hasLakeAccess(player, (cell) => isSiteType(cell.type, "tent") || isSiteType(cell.type, "rv"))) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (hasAmenity(player, "boat_ramp")) {
        income += 3;
        bonuses.push("boat ramp");
      }
      if (hasAmenity(player, "bait_gear")) {
        income += 1;
        bonuses.push("bait or gear sales");
      }
      return buildArrivalMatch(income, ["lake site"], bonuses);
    }
  },
  {
    id: "early-5",
    phase: "early",
    name: "Cabin Weekend Couple",
    requirementsText: "1 cabin",
    bonusText: "+$2 isolated, +$2 scenic",
    baseIncome: 5,
    evaluate: (player) => {
      const cabin = findMatchingSite(player, (cell) => isSiteType(cell.type, "cabin"));
      if (!cabin) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (isIsolatedSite(player, cabin.row, cabin.col)) {
        income += 2;
        bonuses.push("isolated");
      }
      if (isScenicSite(player, cabin.row, cabin.col)) {
        income += 2;
        bonuses.push("scenic");
      }
      return buildArrivalMatch(income, ["cabin"], bonuses);
    }
  },
  {
    id: "early-6",
    phase: "early",
    name: "Minimalist Backpackers",
    requirementsText: "2 tent sites (forest only)",
    bonusText: "+$3 if no amenities nearby",
    noteText: "-$2 if near RVs or vending",
    baseIncome: 5,
    evaluate: (player) => {
      const forestTentSites = getMatchingSites(player, (cell) => isSiteType(cell.type, "tent") && isForestAdjacentCell(cell.row, cell.col));
      if (forestTentSites.length < 2) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      const penalties = [];
      const bestPair = forestTentSites.slice(0, 2);
      if (bestPair.every((cell) => !hasNearbyAmenity(player, cell.row, cell.col, ["bathroom", "shower", "playground", "sports_field", "vending", "boat_ramp", "ice_cream", "firewood"]))) {
        income += 3;
        bonuses.push("no amenities nearby");
      }
      if (bestPair.some((cell) => hasAdjacentSiteType(player, cell.row, cell.col, "rv") || hasNearbyAmenity(player, cell.row, cell.col, ["vending"]))) {
        income -= 2;
        penalties.push("too close to RVs or vending");
      }
      return buildArrivalMatch(Math.max(0, income), ["2 forest tent sites"], bonuses, penalties);
    }
  },
  {
    id: "early-7",
    phase: "early",
    name: "Campground Inspectors",
    requirementsText: "1 bathroom + 1 shower + any site",
    bonusText: "+$5 if all present",
    noteText: "If missing any, gain $0",
    baseIncome: 0,
    evaluate: (player) => {
      if (!hasAmenity(player, "bathroom") || !hasAmenity(player, "shower") || countAnySites(player) < 1) {
        return null;
      }
      return buildArrivalMatch(5, ["bathroom", "shower", "site"], ["inspection passed"]);
    }
  },
  {
    id: "early-8",
    phase: "early",
    name: "Rainy Weekend Travelers",
    requirementsText: "1 cabin or RV",
    bonusText: "+$3 if covered/common area",
    noteText: "Tents cannot satisfy",
    baseIncome: 4,
    evaluate: (player) => {
      if (countSiteType(player, "cabin") < 1 && countSiteType(player, "rv") < 1) {
        return null;
      }
      let income = 4;
      const bonuses = [];
      if (hasAmenity(player, "covered_common_area")) {
        income += 3;
        bonuses.push("covered area");
      }
      return buildArrivalMatch(income, ["cabin or RV"], bonuses);
    }
  },
  {
    id: "early-9",
    phase: "early",
    name: "Family Trial Trip",
    requirementsText: "1 tent + 1 bathroom",
    bonusText: "+$2 playground, +$1 ice cream or vending",
    baseIncome: 4,
    evaluate: (player) => {
      if (countSiteType(player, "tent") < 1 || !hasAmenity(player, "bathroom")) {
        return null;
      }
      let income = 4;
      const bonuses = [];
      if (hasAmenity(player, "playground")) {
        income += 2;
        bonuses.push("playground");
      }
      if (hasAmenity(player, "ice_cream") || hasAmenity(player, "vending")) {
        income += 1;
        bonuses.push("treats");
      }
      return buildArrivalMatch(income, ["tent", "bathroom"], bonuses);
    }
  },
  {
    id: "mid-10",
    phase: "mid",
    name: "Full Hookup RV Rally",
    requirementsText: "3 RV sites with hookups",
    bonusText: "+$6 if all adjacent",
    noteText: "-$3 if near tents",
    baseIncome: 8,
    evaluate: (player) => {
      const rvSites = getMatchingSites(player, (cell) => isSiteType(cell.type, "rv") && hasHookupsForType(cell.type));
      if (rvSites.length < 3) {
        return null;
      }
      let income = 8;
      const bonuses = [];
      const penalties = [];
      const adjacentGroup = findAdjacentGroup(rvSites, 3);
      if (adjacentGroup) {
        income += 6;
        bonuses.push("adjacent rally sites");
        if (adjacentGroup.some((cell) => hasAdjacentSiteType(player, cell.row, cell.col, "tent"))) {
          income -= 3;
          penalties.push("too close to tents");
        }
      } else if (rvSites.some((cell) => hasAdjacentSiteType(player, cell.row, cell.col, "tent"))) {
        income -= 3;
        penalties.push("too close to tents");
      }
      return buildArrivalMatch(Math.max(0, income), ["3 RV hookup sites"], bonuses, penalties);
    }
  },
  {
    id: "mid-11",
    phase: "mid",
    name: "Lake Day Families",
    requirementsText: "2 sites + lake access",
    bonusText: "+$4 playground, +$2 ice cream",
    baseIncome: 6,
    evaluate: (player) => {
      if (countLakeAccessSites(player) < 2) {
        return null;
      }
      let income = 6;
      const bonuses = [];
      if (hasAmenity(player, "playground")) {
        income += 4;
        bonuses.push("playground");
      }
      if (hasAmenity(player, "ice_cream")) {
        income += 2;
        bonuses.push("ice cream");
      }
      return buildArrivalMatch(income, ["2 lake-access sites"], bonuses);
    }
  },
  {
    id: "mid-12",
    phase: "mid",
    name: "Summer Camp Program",
    requirementsText: "2 cabins + 2 tent sites + event space",
    bonusText: "+$6 if fully satisfied",
    noteText: "Big payout",
    baseIncome: 0,
    evaluate: (player) => {
      if (countSiteType(player, "cabin") < 2 || countSiteType(player, "tent") < 2 || !hasAmenity(player, "event_space")) {
        return null;
      }
      return buildArrivalMatch(10, ["2 cabins", "2 tents", "event space"], ["full program"]);
    }
  },
  {
    id: "mid-13",
    phase: "mid",
    name: "Kayak Crew",
    requirementsText: "2 tent or RV + lake",
    bonusText: "+$3 boat ramp, +$2 rentals",
    baseIncome: 6,
    evaluate: (player) => {
      const qualifying = countMatchingSites(player, (cell) => (isSiteType(cell.type, "tent") || isSiteType(cell.type, "rv")) && isLakeAccessCell(cell.row, cell.col));
      if (qualifying < 2) {
        return null;
      }
      let income = 6;
      const bonuses = [];
      if (hasAmenity(player, "boat_ramp")) {
        income += 3;
        bonuses.push("boat ramp");
      }
      if (hasAmenity(player, "rentals")) {
        income += 2;
        bonuses.push("rentals");
      }
      return buildArrivalMatch(income, ["2 lake-access tent/RV sites"], bonuses);
    }
  },
  {
    id: "mid-14",
    phase: "mid",
    name: "Road Trip Influencers",
    requirementsText: "Any 2 sites",
    bonusText: "+$5 if both scenic",
    baseIncome: 4,
    evaluate: (player) => {
      const scenicSites = getMatchingSites(player, (cell) => isAnySiteType(cell.type) && isScenicSite(player, cell.row, cell.col));
      if (countAnySites(player) < 2) {
        return null;
      }
      let income = 4;
      const bonuses = [];
      if (scenicSites.length >= 2) {
        income += 5;
        bonuses.push("2 scenic sites");
      }
      return buildArrivalMatch(income, ["2 sites"], bonuses);
    }
  },
  {
    id: "mid-15",
    phase: "mid",
    name: "Youth Sports Team",
    requirementsText: "3 sites + sports field",
    bonusText: "+$4 if bathrooms nearby",
    noteText: "-$2 if not",
    baseIncome: 6,
    evaluate: (player) => {
      if (countAnySites(player) < 3 || !hasAmenity(player, "sports_field")) {
        return null;
      }
      let income = 6;
      const sportsTiles = getAmenityCells(player, "sports_field");
      const nearBath = sportsTiles.some((cell) => hasNearbyAmenity(player, cell.row, cell.col, ["bathroom"]));
      if (nearBath) {
        income += 4;
        return buildArrivalMatch(income, ["3 sites", "sports field"], ["bathrooms nearby"]);
      }
      income -= 2;
      return buildArrivalMatch(Math.max(0, income), ["3 sites", "sports field"], [], ["no nearby bathrooms"]);
    }
  },
  {
    id: "mid-16",
    phase: "mid",
    name: "Glamping Couple",
    requirementsText: "1 cabin",
    bonusText: "+$4 near lake, +$2 not near tents",
    baseIncome: 5,
    evaluate: (player) => {
      const cabin = findMatchingSite(player, (cell) => isSiteType(cell.type, "cabin"));
      if (!cabin) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (isLakeAccessCell(cabin.row, cabin.col)) {
        income += 4;
        bonuses.push("near lake");
      }
      if (!hasAdjacentSiteType(player, cabin.row, cabin.col, "tent")) {
        income += 2;
        bonuses.push("quiet cabin");
      }
      return buildArrivalMatch(income, ["cabin"], bonuses);
    }
  },
  {
    id: "mid-17",
    phase: "mid",
    name: "Weekend Overflow Crowd",
    requirementsText: "Any 3 empty sites available",
    bonusText: "+$1 per site filled",
    noteText: "-$3 if bathroom capacity exceeded",
    baseIncome: 3,
    evaluate: (player) => {
      const openCapacity = countPotentialSiteCapacity(player);
      if (openCapacity < 3) {
        return null;
      }
      let income = 6;
      const penalties = [];
      if (countAnySites(player) > countAmenity(player, "bathroom") * 4 + 4) {
        income -= 3;
        penalties.push("bathroom capacity strained");
      }
      return buildArrivalMatch(Math.max(0, income), ["space for 3 more campers"], ["fills 3 sites"], penalties);
    }
  },
  {
    id: "mid-18",
    phase: "mid",
    name: "Firewood Fanatics",
    requirementsText: "Any 2 sites",
    bonusText: "+$3 firewood, +$1 per campfire-friendly adjacency",
    baseIncome: 4,
    evaluate: (player) => {
      if (countAnySites(player) < 2) {
        return null;
      }
      let income = 4;
      const bonuses = [];
      if (hasAmenity(player, "firewood")) {
        income += 3;
        bonuses.push("firewood sales");
      }
      const adjacencyBonus = Math.min(3, countCampfireFriendlyAdjacencies(player));
      if (adjacencyBonus > 0) {
        income += adjacencyBonus;
        bonuses.push(`${adjacencyBonus} campfire-friendly adjacencies`);
      }
      return buildArrivalMatch(income, ["2 sites"], bonuses);
    }
  },
  {
    id: "late-19",
    phase: "late",
    name: "Leaf Peepers (Early)",
    requirementsText: "1 tent or cabin + forest",
    bonusText: "+$4 if multiple forest adjacencies",
    baseIncome: 5,
    evaluate: (player) => {
      const scenicSite = findMatchingSite(player, (cell) => (isSiteType(cell.type, "tent") || isSiteType(cell.type, "cabin")) && isForestAdjacentCell(cell.row, cell.col));
      if (!scenicSite) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (countForestAdjacenciesForCell(scenicSite.row, scenicSite.col) >= 2) {
        income += 4;
        bonuses.push("deep forest view");
      }
      return buildArrivalMatch(income, ["forest tent/cabin"], bonuses);
    }
  },
  {
    id: "late-20",
    phase: "late",
    name: "Quiet Retreat Couple",
    requirementsText: "1 cabin",
    bonusText: "+$3 isolated, +$2 away from sports/playground",
    baseIncome: 5,
    evaluate: (player) => {
      const cabin = findMatchingSite(player, (cell) => isSiteType(cell.type, "cabin"));
      if (!cabin) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (isIsolatedSite(player, cabin.row, cabin.col)) {
        income += 3;
        bonuses.push("isolated");
      }
      if (!hasNearbyAmenity(player, cabin.row, cabin.col, ["sports_field", "playground"])) {
        income += 2;
        bonuses.push("quiet amenities");
      }
      return buildArrivalMatch(income, ["cabin"], bonuses);
    }
  },
  {
    id: "late-21",
    phase: "late",
    name: "Discount RV Travelers",
    requirementsText: "1 RV site",
    bonusText: "+$2 if vacancy below half full",
    noteText: "-$2 if crowded",
    baseIncome: 4,
    evaluate: (player) => {
      if (countSiteType(player, "rv") < 1) {
        return null;
      }
      let income = 4;
      const bonuses = [];
      const penalties = [];
      if (hasVacancy(player)) {
        income += 2;
        bonuses.push("vacancy available");
      }
      if (isCrowded(player)) {
        income -= 2;
        penalties.push("crowded park");
      }
      return buildArrivalMatch(Math.max(0, income), ["RV site"], bonuses, penalties);
    }
  },
  {
    id: "late-22",
    phase: "late",
    name: "Late Season Scouts",
    requirementsText: "2 tent sites + forest",
    bonusText: "+$3 event space, +$1 bathrooms nearby",
    baseIncome: 5,
    evaluate: (player) => {
      const forestTents = getMatchingSites(player, (cell) => isSiteType(cell.type, "tent") && isForestAdjacentCell(cell.row, cell.col));
      if (forestTents.length < 2) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (hasAmenity(player, "event_space")) {
        income += 3;
        bonuses.push("event space");
      }
      if (forestTents.some((cell) => hasNearbyAmenity(player, cell.row, cell.col, ["bathroom"]))) {
        income += 1;
        bonuses.push("bathrooms nearby");
      }
      return buildArrivalMatch(income, ["2 forest tent sites"], bonuses);
    }
  },
  {
    id: "late-23",
    phase: "late",
    name: "Fishing Diehards",
    requirementsText: "1 site + lake",
    bonusText: "+$4 boat ramp, +$1 low crowd",
    baseIncome: 5,
    evaluate: (player) => {
      if (!hasLakeAccess(player)) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (hasAmenity(player, "boat_ramp")) {
        income += 4;
        bonuses.push("boat ramp");
      }
      if (countAnySites(player) <= 3) {
        income += 1;
        bonuses.push("low crowd");
      }
      return buildArrivalMatch(income, ["lake-access site"], bonuses);
    }
  },
  {
    id: "late-24",
    phase: "late",
    name: "End-of-Summer Family Trip",
    requirementsText: "2 sites + bathroom",
    bonusText: "+$3 playground, +$2 ice cream",
    baseIncome: 5,
    evaluate: (player) => {
      if (countAnySites(player) < 2 || !hasAmenity(player, "bathroom")) {
        return null;
      }
      let income = 5;
      const bonuses = [];
      if (hasAmenity(player, "playground")) {
        income += 3;
        bonuses.push("playground");
      }
      if (hasAmenity(player, "ice_cream")) {
        income += 2;
        bonuses.push("ice cream");
      }
      return buildArrivalMatch(income, ["2 sites", "bathroom"], bonuses);
    }
  },
  {
    id: "late-25",
    phase: "late",
    name: "Camp Cleanup Volunteers",
    requirementsText: "Any 2 sites",
    bonusText: "Gain +$2",
    baseIncome: 2,
    evaluate: (player) => {
      if (countAnySites(player) < 2) {
        return null;
      }
      return buildArrivalMatch(2, ["2 sites"], ["cleanup bonus"]);
    }
  },
  {
    id: "late-26",
    phase: "late",
    name: "Off-Grid Adventurers",
    requirementsText: "2 forest tent sites",
    bonusText: "+$4 if no amenities nearby",
    noteText: "-$3 if near vending or bathrooms",
    baseIncome: 5,
    evaluate: (player) => {
      const forestTents = getMatchingSites(player, (cell) => isSiteType(cell.type, "tent") && isForestAdjacentCell(cell.row, cell.col));
      if (forestTents.length < 2) {
        return null;
      }
      let income = 5;
      const chosen = forestTents.slice(0, 2);
      const bonuses = [];
      const penalties = [];
      if (chosen.every((cell) => !hasNearbyAmenity(player, cell.row, cell.col, ["bathroom", "shower", "playground", "sports_field", "vending", "ice_cream", "firewood", "boat_ramp"]))) {
        income += 4;
        bonuses.push("fully off-grid");
      }
      if (chosen.some((cell) => hasNearbyAmenity(player, cell.row, cell.col, ["vending", "bathroom"]))) {
        income -= 3;
        penalties.push("too close to services");
      }
      return buildArrivalMatch(Math.max(0, income), ["2 forest tent sites"], bonuses, penalties);
    }
  },
  {
    id: "late-27",
    phase: "late",
    name: "Romantic Anniversary Stay",
    requirementsText: "1 cabin + scenic",
    bonusText: "+$5 if isolated",
    baseIncome: 6,
    evaluate: (player) => {
      const cabin = findMatchingSite(player, (cell) => isSiteType(cell.type, "cabin") && isScenicSite(player, cell.row, cell.col));
      if (!cabin) {
        return null;
      }
      let income = 6;
      const bonuses = [];
      if (isIsolatedSite(player, cabin.row, cabin.col)) {
        income += 5;
        bonuses.push("isolated");
      }
      return buildArrivalMatch(income, ["scenic cabin"], bonuses);
    }
  }
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
  currentSeasonPhase: "early",
  arrivalPhaseCards: [],
  arrivalPhaseResults: [],
  sideHustlePhaseResults: [],
  adjacencyPhaseResults: [],
  activePlayerIndex: 0,
  activeInputIndex: 0,
  playerSetupFocus: "input",
  selectedPiece: null,
  pendingPlacement: null,
  passOverlay: null,
  passConfirmOverlay: false,
  memorialDayOverlay: false,
  laborDayOverlay: false,
  gameOverOverlay: false,
  finalStandings: [],
  exitOverlay: false,
  roundNumber: 1,
  focusedButtonAction: null,
  focusedModalButtonIndex: 0,
  focusedPieceSlotIndex: 0,
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
  const squareType = randomFrom(DRAWABLE_SQUARE_TYPES);

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
  state.memorialDayOverlay = false;
  state.laborDayOverlay = false;
  state.gameOverOverlay = false;
  state.finalStandings = [];
  state.exitOverlay = false;
  state.roundNumber = 1;
  state.focusedButtonAction = null;
  state.focusedModalButtonIndex = 0;
  state.focusedPieceSlotIndex = 0;
  state.currentSeasonPhase = "early";
  state.arrivalPhaseCards = [];
  state.arrivalPhaseResults = [];
  state.sideHustlePhaseResults = [];
  state.adjacencyPhaseResults = [];
  state.statusMessage = `${names[0]}'s turn. Pick from the shared market.`;
  state.screen = "game";
}

function registerButton(button) {
  const hovered = pointInRect(state.pointer.x, state.pointer.y, button);
  state.uiButtons.push({ ...button, hovered });
  const focused = !!button.focused;

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
  const strokeColor = focused ? "#ffcf70" : stroke;
  const strokeWidth = focused ? 4 : 2;

  drawRoundedRect(button.x, button.y, button.w, button.h, 20, fill, strokeColor, strokeWidth);
  drawText(button.label, button.x + button.w / 2, button.y + button.h / 2, {
    font: "700 20px 'Trebuchet MS', sans-serif",
    color: textColor,
    align: "center",
    baseline: "middle"
  });
}

function getActiveOverlayConfig() {
  if (state.gameOverOverlay) {
    return {
      actions: ["return-to-main-menu"],
      defaultAction: "return-to-main-menu",
      cancelAction: null
    };
  }

  if (state.memorialDayOverlay) {
    return {
      actions: ["close-memorial-day-overlay"],
      defaultAction: "close-memorial-day-overlay",
      cancelAction: "close-memorial-day-overlay"
    };
  }

  if (state.laborDayOverlay) {
    return {
      actions: ["begin-office-season"],
      defaultAction: "begin-office-season",
      cancelAction: null
    };
  }

  if (state.exitOverlay) {
    // Default to staying in the game so Space/Enter does not accidentally quit.
    return {
      actions: ["close-exit-overlay", "confirm-exit-game"],
      defaultAction: "close-exit-overlay",
      cancelAction: "close-exit-overlay"
    };
  }

  if (state.passConfirmOverlay) {
    // Default to keeping the player in build mode; passing is the more destructive choice.
    return {
      actions: ["close-pass-confirm", "confirm-pass-round"],
      defaultAction: "close-pass-confirm",
      cancelAction: "close-pass-confirm"
    };
  }

  if (state.passOverlay) {
    return {
      actions: ["close-pass-overlay"],
      defaultAction: "close-pass-overlay",
      cancelAction: "close-pass-overlay"
    };
  }

  return null;
}

function ensureOverlayFocus() {
  const overlay = getActiveOverlayConfig();
  if (!overlay) {
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  const actionIndex = overlay.actions.indexOf(state.focusedButtonAction);
  if (actionIndex >= 0) {
    state.focusedModalButtonIndex = actionIndex;
    return;
  }

  state.focusedModalButtonIndex = Math.max(0, overlay.actions.indexOf(overlay.defaultAction));
  state.focusedButtonAction = overlay.actions[state.focusedModalButtonIndex] || overlay.defaultAction;
}

function setFocusedModalButtonIndex(index) {
  const overlay = getActiveOverlayConfig();
  if (!overlay || !overlay.actions.length) {
    return;
  }

  const normalizedIndex = (index + overlay.actions.length) % overlay.actions.length;
  state.focusedModalButtonIndex = normalizedIndex;
  state.focusedButtonAction = overlay.actions[normalizedIndex];
}

function cycleOverlayButtonFocus(direction) {
  const overlay = getActiveOverlayConfig();
  if (!overlay || overlay.actions.length <= 1) {
    return;
  }

  ensureOverlayFocus();
  setFocusedModalButtonIndex(state.focusedModalButtonIndex + direction);
}

function getDefaultActionForCurrentOverlay() {
  const overlay = getActiveOverlayConfig();
  if (!overlay) {
    return null;
  }
  ensureOverlayFocus();
  return state.focusedButtonAction || overlay.defaultAction;
}

function triggerButtonAction(actionName) {
  if (!actionName) {
    return false;
  }

  const button = state.uiButtons.find((entry) => entry.action === actionName && !entry.disabled) || { action: actionName };
  handleAction(button);
  return true;
}

function getAvailablePieceSlots() {
  const slots = [];
  state.sharedMarket.dominoes.forEach((piece, slotIndex) => {
    if (piece) {
      slots.push({ piece, groupName: "dominoes", slotIndex });
    }
  });
  state.sharedMarket.complex.forEach((piece, slotIndex) => {
    if (piece) {
      slots.push({ piece, groupName: "complex", slotIndex });
    }
  });
  return slots;
}

function ensureFocusedPieceSlot() {
  const slots = getAvailablePieceSlots();
  if (!slots.length) {
    state.focusedPieceSlotIndex = 0;
    return null;
  }

  if (state.focusedPieceSlotIndex < 0 || state.focusedPieceSlotIndex >= slots.length) {
    state.focusedPieceSlotIndex = 0;
  }

  return slots[state.focusedPieceSlotIndex];
}

function cycleFocusedPieceSlot(direction) {
  const slots = getAvailablePieceSlots();
  if (!slots.length) {
    return null;
  }

  state.focusedPieceSlotIndex = (state.focusedPieceSlotIndex + direction + slots.length) % slots.length;
  return slots[state.focusedPieceSlotIndex];
}

function selectFocusedPieceSlot() {
  const slot = ensureFocusedPieceSlot();
  if (!slot) {
    return false;
  }

  state.selectedPiece = {
    groupName: slot.groupName,
    slotIndex: slot.slotIndex,
    piece: slot.piece
  };
  state.pendingPlacement = null;
  state.statusMessage = `${getCurrentPlayerState().name} selected ${BASE_TYPE_LABELS[slot.piece.squareType]} for $${getPieceCost(slot.piece)}.`;
  return true;
}

function drawInputBox(index, x, y, w, h) {
  const active = state.playerSetupFocus === "input" && state.activeInputIndex === index;
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
  state.playerSetupFocus = "input";
  state.statusMessage = "";
}

function removePlayer(index) {
  if (state.players.length === 1) {
    state.players[0] = "";
    state.activeInputIndex = 0;
    state.playerSetupFocus = "input";
    state.statusMessage = "At least one player slot stays on screen.";
    return;
  }

  state.players.splice(index, 1);
  state.activeInputIndex = Math.max(0, Math.min(state.activeInputIndex, state.players.length - 1));
  state.playerSetupFocus = "input";
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

function buildArrivalMatch(income, requirements, bonuses = [], penalties = [], notes = []) {
  return {
    qualified: income > 0,
    income: Math.max(0, income),
    requirements,
    bonuses,
    penalties,
    notes
  };
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function getArrivalCardsForPhase(phase) {
  return ARRIVAL_CARD_DEFINITIONS.filter((card) => card.phase === phase);
}

function buildArrivalPhaseDeck(phase) {
  return shuffleArray(
    getArrivalCardsForPhase(phase).flatMap((card) => [
      { ...card, deckCopy: 1, instanceId: `${card.id}-a` },
      { ...card, deckCopy: 2, instanceId: `${card.id}-b` }
    ])
  );
}

function normalizeSquareType(squareType) {
  if (squareType === "tent_electric") {
    return "tent";
  }

  if (squareType === "field_sports") {
    return "sports_field";
  }

  if (squareType === "education_pavilion") {
    return "educational_pavilion";
  }

  // Keep old prototype boards readable without spawning new "test" tiles.
  if (squareType === "test") {
    return "recreation_field";
  }

  return squareType;
}

function isSiteType(squareType, type) {
  return normalizeSquareType(squareType) === type;
}

function isAnySiteType(squareType) {
  return ["rustic", "tent", "rv", "cabin"].includes(normalizeSquareType(squareType));
}

function getAllOccupiedCells(player) {
  const cells = [];
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const type = player.grid[row][col];
      if (!type) {
        continue;
      }
      cells.push({
        row,
        col,
        type,
        normalizedType: normalizeSquareType(type)
      });
    }
  }
  return cells;
}

function getSiteCells(player) {
  return getAllOccupiedCells(player).filter((cell) => isAnySiteType(cell.type));
}

function getAmenityCells(player, amenity) {
  return getAllOccupiedCells(player).filter((cell) => cellMatchesAmenity(cell.type, amenity));
}

function cellMatchesAmenity(squareType, amenity) {
  const type = normalizeSquareType(squareType);
  const amenityMap = {
    bathroom: ["bathroom"],
    shower: ["shower"],
    playground: ["playground"],
    sports_field: ["sports_field", "field_sports", "recreation_field"],
    boat_ramp: ["boat_ramp_dock"],
    event_space: ["educational_pavilion", "activities_pavilion", "covered_common_area"],
    education_space: ["educational_pavilion"],
    covered_common_area: ["covered_common_area"],
    vending: ["vending"],
    ice_cream: ["ice_cream_addon"],
    firewood: ["camp_fire_wood_store_addon", "camp_fire_wood_store", "firewood_addon"],
    bait_gear: ["bait_gear"],
    rentals: ["rentals"]
  };

  const directMatches = amenityMap[amenity] || [];
  return directMatches.includes(type);
}

function countSiteType(player, type) {
  return getSiteCells(player).filter((cell) => isSiteType(cell.type, type)).length;
}

function countAnySites(player) {
  return getSiteCells(player).length;
}

function countAmenity(player, amenity) {
  return getAmenityCells(player, amenity).length;
}

function hasAmenity(player, amenity) {
  return countAmenity(player, amenity) > 0;
}

function hasHookupsForType(squareType) {
  const type = normalizeSquareType(squareType);
  return type === "rv" || squareType === "tent_electric";
}

function getOrthogonalNeighbors(row, col) {
  return [
    { row: row - 1, col },
    { row: row + 1, col },
    { row, col: col - 1 },
    { row, col: col + 1 }
  ].filter((cell) => cell.row >= 0 && cell.row < GRID_ROWS && cell.col >= 0 && cell.col < GRID_COLS);
}

function getNearbyCells(row, col, distance = 1) {
  const cells = [];
  for (let dy = -distance; dy <= distance; dy += 1) {
    for (let dx = -distance; dx <= distance; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      const nextRow = row + dy;
      const nextCol = col + dx;
      if (nextRow < 0 || nextRow >= GRID_ROWS || nextCol < 0 || nextCol >= GRID_COLS) {
        continue;
      }
      cells.push({ row: nextRow, col: nextCol });
    }
  }
  return cells;
}

function getCellType(player, row, col) {
  return player.grid[row]?.[col] || null;
}

function hasAdjacentSiteType(player, row, col, siteType) {
  return getOrthogonalNeighbors(row, col).some((neighbor) => isSiteType(getCellType(player, neighbor.row, neighbor.col), siteType));
}

function hasNearbyAmenity(player, row, col, amenities) {
  return getNearbyCells(row, col, 1).some((neighbor) => {
    const type = getCellType(player, neighbor.row, neighbor.col);
    return amenities.some((amenity) => cellMatchesAmenity(type, amenity));
  });
}

function isLakeAccessCell(row, col) {
  return row === 0;
}

function isForestAdjacentCell(row, col) {
  return col === 0;
}

function countForestAdjacenciesForCell(row, col) {
  return col === 0 ? 2 : col === 1 ? 1 : 0;
}

function hasLakeAccess(player, predicate = () => true) {
  return getSiteCells(player).some((cell) => isLakeAccessCell(cell.row, cell.col) && predicate(cell));
}

function countLakeAccessSites(player) {
  return getSiteCells(player).filter((cell) => isLakeAccessCell(cell.row, cell.col)).length;
}

function countForestAdjacentSites(player, type) {
  return getSiteCells(player).filter((cell) => isSiteType(cell.type, type) && isForestAdjacentCell(cell.row, cell.col)).length;
}

function findMatchingSite(player, predicate) {
  return getSiteCells(player).find(predicate) || null;
}

function getMatchingSites(player, predicate) {
  return getSiteCells(player).filter(predicate);
}

function countMatchingSites(player, predicate) {
  return getMatchingSites(player, predicate).length;
}

function isScenicSite(player, row, col) {
  return isLakeAccessCell(row, col) || isForestAdjacentCell(row, col);
}

function isIsolatedSite(player, row, col) {
  return getOrthogonalNeighbors(row, col).every((neighbor) => !getCellType(player, neighbor.row, neighbor.col));
}

function countAdjacentOccupiedSites(player, row, col) {
  return getOrthogonalNeighbors(row, col).filter((neighbor) => !!getCellType(player, neighbor.row, neighbor.col)).length;
}

function isCrowded(player) {
  return countAnySites(player) > 6;
}

function hasVacancy(player) {
  return countAnySites(player) < Math.max(1, Math.floor(countPotentialSiteCapacity(player) / 2));
}

function countPotentialSiteCapacity(player) {
  const existingSiteCount = countAnySites(player);
  const openGrassEstimate = Math.max(0, 12 - existingSiteCount);
  return existingSiteCount + openGrassEstimate;
}

function findAdjacentGroup(cells, targetSize) {
  const cellKey = (cell) => `${cell.row},${cell.col}`;
  const lookup = new Map(cells.map((cell) => [cellKey(cell), cell]));

  for (const startCell of cells) {
    const queue = [startCell];
    const visited = new Set([cellKey(startCell)]);
    const group = [];

    while (queue.length) {
      const current = queue.shift();
      group.push(current);
      if (group.length >= targetSize) {
        return group.slice(0, targetSize);
      }
      getOrthogonalNeighbors(current.row, current.col).forEach((neighbor) => {
        const key = `${neighbor.row},${neighbor.col}`;
        if (!lookup.has(key) || visited.has(key)) {
          return;
        }
        visited.add(key);
        queue.push(lookup.get(key));
      });
    }
  }

  return null;
}

function countCampfireFriendlyAdjacencies(player) {
  let total = 0;
  getSiteCells(player).forEach((cell) => {
    total += getOrthogonalNeighbors(cell.row, cell.col).filter((neighbor) => {
      const type = getCellType(player, neighbor.row, neighbor.col);
      return isAnySiteType(type);
    }).length;
  });
  return Math.floor(total / 2);
}

function getPlayerInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function evaluateArrivalCardForPlayer(card, player) {
  const match = card.evaluate(player);
  if (!match || !match.qualified || match.income <= 0) {
    return null;
  }

  return {
    playerName: player.name,
    playerInitials: getPlayerInitials(player.name),
    income: match.income,
    detail: match
  };
}

function evaluateArrivalPhase(cards) {
  const cardResults = cards.map((card) => {
    const matches = state.playerStates
      .map((player) => evaluateArrivalCardForPlayer(card, player))
      .filter(Boolean);
    return {
      card,
      matches
    };
  });

  const playerSummaries = state.playerStates.map((player) => ({
    playerName: player.name,
    initials: getPlayerInitials(player.name),
    matchedCards: cardResults.filter((result) => result.matches.some((match) => match.playerName === player.name)).length,
    income: cardResults.reduce((total, result) => {
      const match = result.matches.find((entry) => entry.playerName === player.name);
      return total + (match ? match.income : 0);
    }, 0)
  }));

  return {
    cardResults,
    playerSummaries
  };
}

function getSpecificTypeCells(player, squareTypes) {
  return getAllOccupiedCells(player).filter((cell) => squareTypes.includes(cell.type));
}

function getNearbySiteCountForAmenity(player, row, col, sitePredicate, distance = 1) {
  return getNearbyCells(row, col, distance).filter((cell) => {
    const type = getCellType(player, cell.row, cell.col);
    return type && isAnySiteType(type) && sitePredicate({
      row: cell.row,
      col: cell.col,
      type,
      normalizedType: normalizeSquareType(type)
    });
  }).length;
}

function getNearbyAmenityCount(player, row, col, amenityList, distance = 1) {
  return getNearbyCells(row, col, distance).filter((cell) => {
    const type = getCellType(player, cell.row, cell.col);
    return amenityList.some((amenity) => cellMatchesAmenity(type, amenity));
  }).length;
}

function getLakeAccessSiteCountByTypes(player, siteTypes) {
  return getSiteCells(player).filter((cell) => siteTypes.includes(normalizeSquareType(cell.type)) && isLakeAccessCell(cell.row, cell.col)).length;
}

function isFamilyFriendlySite(player, cell) {
  return (
    isSiteType(cell.type, "tent") ||
    isSiteType(cell.type, "cabin") ||
    hasNearbyAmenity(player, cell.row, cell.col, ["playground", "beach"])
  );
}

function getOrthogonalAdjacentMatches(player, row, col, predicate) {
  return getOrthogonalNeighbors(row, col)
    .map((neighbor) => {
      const type = getCellType(player, neighbor.row, neighbor.col);
      if (!type) {
        return null;
      }
      return {
        row: neighbor.row,
        col: neighbor.col,
        type,
        normalizedType: normalizeSquareType(type)
      };
    })
    .filter((cell) => cell && predicate(cell));
}

function getNearbyMatches(player, row, col, distance, predicate) {
  return getNearbyCells(row, col, distance)
    .map((neighbor) => {
      const type = getCellType(player, neighbor.row, neighbor.col);
      if (!type) {
        return null;
      }
      return {
        row: neighbor.row,
        col: neighbor.col,
        type,
        normalizedType: normalizeSquareType(type)
      };
    })
    .filter((cell) => cell && predicate(cell));
}

function getAmenityDemandScore(player, amenityType) {
  const demandCells = getAmenityCells(player, amenityType).length
    ? getAmenityCells(player, amenityType)
    : getSpecificTypeCells(player, [amenityType]);
  if (!demandCells.length) {
    return 0;
  }

  return Math.max(...demandCells.map((cell) => {
    const trafficAmenities = getNearbyAmenityCount(player, cell.row, cell.col, ["bathroom", "shower", "playground", "sports_field", "beach"], 2);
    const nearbySites = getNearbySiteCountForAmenity(player, cell.row, cell.col, () => true, 2);
    return trafficAmenities + Math.floor(nearbySites / 2);
  }));
}

function evaluateSingleSideHustle(player, hustleType) {
  if (hustleType === "ice_cream") {
    const sources = getAmenityCells(player, "ice_cream");
    if (sources.length === 0) {
      return null;
    }
    const nearbyDemand = Math.max(...sources.map((cell) =>
      getNearbySiteCountForAmenity(player, cell.row, cell.col, (site) => isFamilyFriendlySite(player, site), 2)
    ));
    const cappedDemand = Math.min(3, nearbyDemand);
    const reasons = [];
    let income = cappedDemand;
    if (cappedDemand > 0) {
      reasons.push(`${cappedDemand} nearby family sites`);
    }
    if (hasAmenity(player, "playground")) {
      income += 1;
      reasons.push("playground bonus");
    }
    return { type: "ice_cream", label: "Ice Cream", income, reasons };
  }

  if (hustleType === "firewood") {
    const sources = getAmenityCells(player, "firewood");
    if (sources.length === 0) {
      return null;
    }
    const nearbyDemand = Math.max(...sources.map((cell) =>
      getNearbySiteCountForAmenity(player, cell.row, cell.col, (site) => ["rustic", "tent", "cabin"].includes(normalizeSquareType(site.type)), 2)
    ));
    const cappedDemand = Math.min(4, nearbyDemand);
    const reasons = [];
    let income = cappedDemand;
    if (cappedDemand > 0) {
      reasons.push(`${cappedDemand} campfire-friendly sites`);
    }
    if (getSiteCells(player).some((cell) => ["rustic", "tent", "cabin"].includes(normalizeSquareType(cell.type)) && isForestAdjacentCell(cell.row, cell.col))) {
      income += 1;
      reasons.push("forest edge bonus");
    }
    return { type: "firewood", label: "Firewood", income: Math.min(5, income), reasons };
  }

  if (hustleType === "vending") {
    const sources = getAmenityCells(player, "vending");
    if (sources.length === 0) {
      return null;
    }
    const nearbyTraffic = Math.max(...sources.map((cell) =>
      getNearbyAmenityCount(player, cell.row, cell.col, ["bathroom", "shower", "sports_field", "playground", "beach", "boat_ramp"], 2)
    ));
    const income = Math.min(3, nearbyTraffic);
    return { type: "vending", label: "Vending", income, reasons: income > 0 ? [`${income} nearby traffic clusters`] : [] };
  }

  if (hustleType === "bait_gear") {
    const sources = getAmenityCells(player, "bait_gear");
    if (sources.length === 0) {
      return null;
    }
    let income = Math.min(3, getLakeAccessSiteCountByTypes(player, ["tent", "rv", "rustic", "cabin"]));
    const reasons = income > 0 ? [`${income} lake-access sites`] : [];
    if (hasAmenity(player, "boat_ramp")) {
      income += 1;
      reasons.push("boat ramp bonus");
    }
    return { type: "bait_gear", label: "Bait & Gear", income, reasons };
  }

  if (hustleType === "rentals") {
    const sources = getAmenityCells(player, "rentals");
    if (sources.length === 0) {
      return null;
    }
    let income = Math.min(3, getLakeAccessSiteCountByTypes(player, ["tent", "rv"]));
    const reasons = income > 0 ? [`${income} lake-access tent/RV sites`] : [];
    if (hasAmenity(player, "beach") || hasAmenity(player, "boat_ramp")) {
      income += 1;
      reasons.push("water recreation bonus");
    }
    return { type: "rentals", label: "Rentals", income, reasons };
  }

  if (hustleType === "camp_store") {
    const sources = getSpecificTypeCells(player, ["camp_store"]);
    if (sources.length === 0) {
      return null;
    }
    const income = Math.min(3, Math.floor(countAnySites(player) / 3));
    return { type: "camp_store", label: "Camp Store", income, reasons: income > 0 ? [`${countAnySites(player)} occupied sites`] : [] };
  }

  if (hustleType === "boat_ramp") {
    const sources = getAmenityCells(player, "boat_ramp");
    if (sources.length === 0) {
      return null;
    }
    let income = Math.min(3, getLakeAccessSiteCountByTypes(player, ["tent", "rv", "rustic", "cabin"]));
    const reasons = income > 0 ? [`${income} lake-access sites`] : [];
    if (hasAmenity(player, "rentals") || hasAmenity(player, "bait_gear")) {
      income += 1;
      reasons.push("dock support combo");
    }
    return { type: "boat_ramp", label: "Boat Ramp", income, reasons };
  }

  return null;
}

function evaluateSideHustlesForPlayer(player) {
  const hustleTypes = ["ice_cream", "firewood", "vending", "bait_gear", "rentals", "camp_store", "boat_ramp"];
  const hustles = hustleTypes
    .map((hustleType) => evaluateSingleSideHustle(player, hustleType))
    .filter((hustle) => hustle && hustle.income > 0);

  return {
    playerName: player.name,
    totalIncome: hustles.reduce((total, hustle) => total + hustle.income, 0),
    hustles
  };
}

const ADJACENCY_RULES = [
  {
    type: "forest_tents",
    label: "Forest Tents",
    evaluate(player) {
      const qualifyingTents = getSiteCells(player).filter((cell) =>
        isSiteType(cell.type, "tent") && (isForestAdjacentCell(cell.row, cell.col) || hasNearbyAmenity(player, cell.row, cell.col, ["forest_path"]))
      );
      const income = Math.min(3, qualifyingTents.length);
      return {
        type: "forest_tents",
        label: "Forest Tents",
        income,
        penalties: 0,
        reasons: income > 0 ? [`${income} tent sites by the woods`] : []
      };
    }
  },
  {
    type: "lake_cabins",
    label: "Lake Cabins",
    evaluate(player) {
      const qualifyingCabins = getSiteCells(player).filter((cell) =>
        isSiteType(cell.type, "cabin") && (isLakeAccessCell(cell.row, cell.col) || hasNearbyAmenity(player, cell.row, cell.col, ["beach"]))
      );
      const income = Math.min(4, qualifyingCabins.length * 2);
      return {
        type: "lake_cabins",
        label: "Lake Cabins",
        income,
        penalties: 0,
        reasons: income > 0 ? [`${qualifyingCabins.length} scenic cabin sites`] : []
      };
    }
  },
  {
    type: "rv_support",
    label: "RV Support",
    evaluate(player) {
      const supportedRvs = getSiteCells(player).filter((cell) =>
        isSiteType(cell.type, "rv") &&
        getNearbyMatches(player, cell.row, cell.col, 2, (neighbor) =>
          ["bathroom", "shower", "water_station", "septic_dump"].includes(normalizeSquareType(neighbor.type))
        ).length > 0
      );
      const income = Math.min(4, supportedRvs.length);
      return {
        type: "rv_support",
        label: "RV Support",
        income,
        penalties: 0,
        reasons: income > 0 ? [`${income} RV sites near utility support`] : []
      };
    }
  },
  {
    type: "family_zone",
    label: "Family Zone",
    evaluate(player) {
      const qualifyingPlaygrounds = getAmenityCells(player, "playground").filter((cell) =>
        getNearbySiteCountForAmenity(player, cell.row, cell.col, (site) => ["tent", "cabin"].includes(normalizeSquareType(site.type)), 2) >= 2
      );
      const income = Math.min(3, qualifyingPlaygrounds.length);
      return {
        type: "family_zone",
        label: "Family Zone",
        income,
        penalties: 0,
        reasons: income > 0 ? [`${income} playground hubs serving families`] : []
      };
    }
  },
  {
    type: "boating_hub",
    label: "Boating Hub",
    evaluate(player) {
      const hubs = getSpecificTypeCells(player, ["boat_ramp_dock"]);
      let income = 0;
      let comboBonus = 0;
      hubs.forEach((cell) => {
        const nearbyLakeSites = getNearbyMatches(player, cell.row, cell.col, 2, (neighbor) =>
          isAnySiteType(neighbor.type) && isLakeAccessCell(neighbor.row, neighbor.col)
        ).length;
        if (nearbyLakeSites >= 2) {
          income += 1;
          if (getNearbyMatches(player, cell.row, cell.col, 2, (neighbor) => ["bait_gear", "rentals"].includes(normalizeSquareType(neighbor.type))).length > 0) {
            comboBonus += 1;
          }
        }
      });
      const totalIncome = Math.min(4, income + comboBonus);
      const reasons = [];
      if (income > 0) {
        reasons.push(`${income} active dock hubs`);
      }
      if (comboBonus > 0) {
        reasons.push(`${Math.min(comboBonus, Math.max(0, 4 - income))} dock support bonus`);
      }
      return {
        type: "boating_hub",
        label: "Boating Hub",
        income: totalIncome,
        penalties: 0,
        reasons
      };
    }
  },
  {
    type: "event_cluster",
    label: "Event Cluster",
    evaluate(player) {
      const eventCells = getSpecificTypeCells(player, ["education_pavilion", "activities_pavilion"]);
      const activeClusters = eventCells.filter((cell) =>
        getNearbySiteCountForAmenity(player, cell.row, cell.col, (site) => ["tent", "cabin"].includes(normalizeSquareType(site.type)), 2) >= 2
      );
      const income = Math.min(3, activeClusters.length);
      return {
        type: "event_cluster",
        label: "Event Cluster",
        income,
        penalties: 0,
        reasons: income > 0 ? [`${income} event spaces near campers`] : []
      };
    }
  },
  {
    type: "camp_store_traffic",
    label: "Store Traffic",
    evaluate(player) {
      const trafficCells = [
        ...getSpecificTypeCells(player, ["camp_store"]),
        ...getSpecificTypeCells(player, ["vending"])
      ];
      const activeTraffic = trafficCells.filter((cell) => getAmenityDemandScore(player, normalizeSquareType(cell.type)) >= 2);
      const income = Math.min(3, activeTraffic.length);
      return {
        type: "camp_store_traffic",
        label: "Store Traffic",
        income,
        penalties: 0,
        reasons: income > 0 ? [`${income} high-traffic retail spots`] : []
      };
    }
  },
  {
    type: "noisy_mix",
    label: "Noisy Mix",
    evaluate(player) {
      const noisyRvs = getSiteCells(player).filter((cell) =>
        isSiteType(cell.type, "rv") && hasAdjacentSiteType(player, cell.row, cell.col, "tent")
      );
      const penalties = Math.min(3, noisyRvs.length);
      return {
        type: "noisy_mix",
        label: "Noisy Mix",
        income: 0,
        penalties,
        reasons: penalties > 0 ? [`${penalties} RV sites crowding tents`] : []
      };
    }
  },
  {
    type: "quiet_cabin_penalty",
    label: "Quiet Cabin Conflict",
    evaluate(player) {
      const scenicCabins = getSiteCells(player).filter((cell) => isSiteType(cell.type, "cabin") && isScenicSite(player, cell.row, cell.col));
      const penalties = Math.min(2, scenicCabins.filter((cell) =>
        !isIsolatedSite(player, cell.row, cell.col) &&
        getOrthogonalAdjacentMatches(player, cell.row, cell.col, (neighbor) =>
          ["field_sports", "recreation_field", "playground"].includes(normalizeSquareType(neighbor.type))
        ).length > 0
      ).length);
      return {
        type: "quiet_cabin_penalty",
        label: "Quiet Cabin Conflict",
        income: 0,
        penalties,
        reasons: penalties > 0 ? [`${penalties} scenic cabins next to noisy zones`] : []
      };
    }
  },
  {
    type: "service_gap",
    label: "Service Gap",
    evaluate(player) {
      const lowServiceSites = getSiteCells(player).filter((cell) =>
        ["tent", "rustic"].includes(normalizeSquareType(cell.type)) &&
        getNearbyMatches(player, cell.row, cell.col, 2, (neighbor) => ["bathroom", "shower"].includes(normalizeSquareType(neighbor.type))).length === 0
      );
      let penalties = 0;
      if (lowServiceSites.length >= 4) {
        penalties = 2;
      } else if (lowServiceSites.length >= 2) {
        penalties = 1;
      }
      return {
        type: "service_gap",
        label: "Service Gap",
        income: 0,
        penalties,
        reasons: penalties > 0 ? [`${lowServiceSites.length} tent/rustic sites lack support`] : []
      };
    }
  }
];

function evaluateAdjacencyRule(player, rule) {
  const result = rule.evaluate(player) || {};
  const income = Math.max(0, result.income || 0);
  const penalties = Math.max(0, result.penalties || 0);
  return {
    type: result.type || rule.type,
    label: result.label || rule.label,
    income,
    penalties,
    netIncome: income - penalties,
    reasons: result.reasons || []
  };
}

function evaluateAdjacencyForPlayer(player) {
  const results = ADJACENCY_RULES
    .map((rule) => evaluateAdjacencyRule(player, rule))
    .filter((result) => result.income > 0 || result.penalties > 0);

  const totalIncome = results.reduce((total, result) => total + result.income, 0);
  const totalPenalty = results.reduce((total, result) => total + result.penalties, 0);

  return {
    playerName: player.name,
    totalIncome,
    totalPenalty,
    netIncome: totalIncome - totalPenalty,
    results
  };
}

function revealArrivalCardsForPhase(phase) {
  const deck = buildArrivalPhaseDeck(phase);
  const revealedCards = deck.slice(0, 6);
  state.currentSeasonPhase = phase;
  state.arrivalPhaseCards = revealedCards;
  state.arrivalPhaseResults = evaluateArrivalPhase(revealedCards);
  state.sideHustlePhaseResults = state.playerStates.map((player) => evaluateSideHustlesForPlayer(player));
  state.adjacencyPhaseResults = state.playerStates.map((player) => evaluateAdjacencyForPlayer(player));
  state.arrivalPhaseResults.playerSummaries.forEach((summary) => {
    const player = state.playerStates.find((entry) => entry.name === summary.playerName);
    if (player) {
      player.cash += summary.income;
    }
  });
  state.sideHustlePhaseResults.forEach((summary) => {
    const player = state.playerStates.find((entry) => entry.name === summary.playerName);
    if (player) {
      player.cash += summary.totalIncome;
    }
  });
  state.adjacencyPhaseResults.forEach((summary) => {
    const player = state.playerStates.find((entry) => entry.name === summary.playerName);
    if (player) {
      player.cash += summary.netIncome;
    }
  });
  console.log(`[arrival-phase] ${phase}`, revealedCards.map((card) => `${card.instanceId}:${card.name}`));
  console.log(`[side-hustles] ${phase}`, state.sideHustlePhaseResults);
  console.log(`[adjacency] ${phase}`, state.adjacencyPhaseResults);
}

function advanceSeasonPhase() {
  const currentIndex = ARRIVAL_PHASE_ORDER.indexOf(state.currentSeasonPhase);
  if (currentIndex === ARRIVAL_PHASE_ORDER.length - 1) {
    state.laborDayOverlay = true;
    state.focusedButtonAction = "begin-office-season";
    state.focusedModalButtonIndex = 0;
    return;
  }

  const nextPhase = ARRIVAL_PHASE_ORDER[(currentIndex + 1) % ARRIVAL_PHASE_ORDER.length];
  revealArrivalCardsForPhase(nextPhase);
  state.statusMessage = `${ARRIVAL_PHASE_LABELS[nextPhase]} arrivals are now showing.`;
}

function showGameOverOverlay() {
  state.finalStandings = [...state.playerStates]
    .sort((left, right) => right.cash - left.cash)
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      cash: player.cash
    }));
  state.gameOverOverlay = true;
  state.memorialDayOverlay = false;
  state.laborDayOverlay = false;
  state.focusedButtonAction = "return-to-main-menu";
  state.focusedModalButtonIndex = 0;
  state.statusMessage = `${MAX_ROUNDS} years are complete. Final standings are ready.`;
}

function beginOfficeSeason() {
  if (state.roundNumber >= MAX_ROUNDS) {
    showGameOverOverlay();
    return;
  }

  state.roundNumber += 1;
  state.playerStates.forEach((player) => {
    player.passedThisRound = false;
  });
  state.sharedMarket = createPieceMarket();
  state.activePlayerIndex = 0;
  state.selectedPiece = null;
  state.pendingPlacement = null;
  state.passOverlay = {
    nextPlayerName: state.playerStates[0].name,
    message: `Off season begins. ${state.playerStates[0].name} goes first.`
  };
  state.focusedButtonAction = "close-pass-overlay";
  state.focusedModalButtonIndex = 0;
  state.passConfirmOverlay = false;
  state.memorialDayOverlay = false;
  state.laborDayOverlay = false;
  state.gameOverOverlay = false;
  state.exitOverlay = false;
  state.currentSeasonPhase = "early";
  state.arrivalPhaseCards = [];
  state.arrivalPhaseResults = [];
  state.sideHustlePhaseResults = [];
  state.adjacencyPhaseResults = [];
  state.statusMessage = state.passOverlay.message;
  state.screen = "game";
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

function startCampingSeason() {
  state.selectedPiece = null;
  state.pendingPlacement = null;
  state.passOverlay = null;
  state.passConfirmOverlay = false;
  revealArrivalCardsForPhase("early");
  state.memorialDayOverlay = true;
  state.focusedButtonAction = "close-memorial-day-overlay";
  state.focusedModalButtonIndex = 0;
  state.statusMessage = "Memorial Day has come! Time to host campers.";
  state.screen = "season";
}

function advanceTurn() {
  if (state.playerStates.length === 0) {
    return;
  }

  if (allPlayersPassed()) {
    startCampingSeason();
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
  state.focusedButtonAction = "close-pass-overlay";
  state.focusedModalButtonIndex = 0;
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
    disabled: getEnteredPlayerCount() < 2,
    focused: state.playerSetupFocus === "start"
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
  const focusedSlot = getAvailablePieceSlots()[state.focusedPieceSlotIndex];
  const focused = !!focusedSlot && focusedSlot.groupName === groupName && focusedSlot.slotIndex === slotIndex;

  state.pieceSlots.push({ x, y, w, h, piece, groupName, slotIndex });

  drawRoundedRect(
    x,
    y,
    w,
    h,
    16,
    selected ? "rgba(255, 179, 71, 0.24)" : focused ? "rgba(159, 199, 243, 0.16)" : "rgba(255, 255, 255, 0.08)",
    selected ? "#ffb347" : focused ? "#ffcf70" : hovered ? "rgba(255, 255, 255, 0.35)" : "rgba(255, 255, 255, 0.18)",
    selected ? 3 : focused ? 3 : 2
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
  ensureFocusedPieceSlot();

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

  drawPendingPlacement();

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

function drawArrivalCard(result, x, y, w, h) {
  const phaseColor = state.currentSeasonPhase === "early"
    ? "#6fbf73"
    : state.currentSeasonPhase === "mid"
      ? "#f3b04f"
      : "#d97f56";

  drawRoundedRect(x, y, w, h, 14, "rgba(255, 248, 231, 0.96)", "rgba(24, 49, 83, 0.28)", 2);
  drawRoundedRect(x, y, w, 24, 14, phaseColor, phaseColor, 1);
  drawText(result.card.name, x + 10, y + 42, {
    font: "700 14px 'Trebuchet MS', sans-serif",
    color: NAVY
  });
  drawText(ARRIVAL_PHASE_LABELS[result.card.phase], x + w - 10, y + 14, {
    font: "700 11px 'Trebuchet MS', sans-serif",
    color: "#10233f",
    align: "right",
    baseline: "middle"
  });
  drawWrappedText(result.card.requirementsText, x + w / 2, y + 58, w - 22, 18, {
    font: "12px 'Trebuchet MS', sans-serif",
    color: NAVY_DARK,
    align: "center"
  });
  drawWrappedText(`Bonus: ${result.card.bonusText}`, x + w / 2, y + 98, w - 22, 15, {
    font: "11px 'Trebuchet MS', sans-serif",
    color: "#21456f",
    align: "center"
  });

  if (result.card.noteText) {
    drawWrappedText(result.card.noteText, x + w / 2, y + 126, w - 24, 14, {
      font: "10px 'Trebuchet MS', sans-serif",
      color: "#6b4d2f",
      align: "center"
    });
  }

  drawText(`Base $${result.card.baseIncome}`, x + 10, y + h - 12, {
    font: "700 12px 'Trebuchet MS', sans-serif",
    color: NAVY
  });

  result.matches.forEach((match, index) => {
    drawRoundedRect(x + 12 + index * 30, y + h - 34, 24, 18, 9, NAVY, "#9ec7f3", 1);
    drawText(match.playerInitials, x + 24 + index * 30, y + h - 25, {
      font: "700 10px 'Trebuchet MS', sans-serif",
      color: CREAM,
      align: "center",
      baseline: "middle"
    });
  });
}

function drawArrivalSummary() {
  drawRoundedRect(690, 140, 214, 96, 18, "rgba(15, 20, 44, 0.88)", "rgba(255, 216, 155, 0.28)", 2);
  drawText("Arrival Summary", 797, 158, {
    font: "700 18px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });

  state.arrivalPhaseResults.playerSummaries.forEach((summary, index) => {
    const top = 170 + index * 12;
    drawRoundedRect(704, top, 186, 18, 9, "rgba(255, 248, 231, 0.1)", "rgba(255, 216, 155, 0.18)", 1);
    drawText(summary.playerName, 710, top + 10, {
      font: "700 10px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      baseline: "middle"
    });
    drawText(`${summary.matchedCards} cards`, 830, top + 10, {
      font: "9px 'Trebuchet MS', sans-serif",
      color: "#d8cee0",
      align: "right",
      baseline: "middle"
    });
    drawText(`+$${summary.income}`, 884, top + 10, {
      font: "700 11px 'Trebuchet MS', sans-serif",
      color: "#ffe6b9",
      align: "right",
      baseline: "middle"
    });
  });
}

function drawSideHustleSummary() {
  drawRoundedRect(690, 246, 214, 96, 18, "rgba(15, 20, 44, 0.88)", "rgba(255, 216, 155, 0.28)", 2);
  drawText("Side Hustles", 797, 264, {
    font: "700 18px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });

  state.sideHustlePhaseResults.forEach((summary, index) => {
    const top = 276 + index * 12;
    const topHustle = summary.hustles[0];
    drawRoundedRect(704, top, 186, 18, 9, "rgba(255, 248, 231, 0.1)", "rgba(255, 216, 155, 0.18)", 1);
    drawText(summary.playerName, 710, top + 10, {
      font: "700 10px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      baseline: "middle"
    });
    drawText(topHustle ? topHustle.label : "No side income", 832, top + 10, {
      font: "9px 'Trebuchet MS', sans-serif",
      color: topHustle ? "#d8cee0" : "rgba(216, 206, 224, 0.7)",
      align: "right",
      baseline: "middle"
    });
    drawText(`+$${summary.totalIncome}`, 884, top + 10, {
      font: "700 11px 'Trebuchet MS', sans-serif",
      color: summary.totalIncome > 0 ? "#b8f7aa" : "#d8cee0",
      align: "right",
      baseline: "middle"
    });
  });
}

function drawAdjacencySummary() {
  drawRoundedRect(690, 352, 214, 96, 18, "rgba(15, 20, 44, 0.88)", "rgba(255, 216, 155, 0.28)", 2);
  drawText("Adjacency Bonuses", 797, 370, {
    font: "700 18px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });

  state.adjacencyPhaseResults.forEach((summary, index) => {
    const top = 382 + index * 12;
    const topResult = [...summary.results].sort((a, b) => Math.abs(b.netIncome) - Math.abs(a.netIncome))[0];
    const netLabel = summary.netIncome >= 0 ? `+$${summary.netIncome}` : `-$${Math.abs(summary.netIncome)}`;
    drawRoundedRect(704, top, 186, 18, 9, "rgba(255, 248, 231, 0.1)", "rgba(255, 216, 155, 0.18)", 1);
    drawText(summary.playerName, 710, top + 10, {
      font: "700 10px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      baseline: "middle"
    });
    drawText(topResult ? `${topResult.label} ${topResult.netIncome >= 0 ? "+" : ""}${topResult.netIncome}` : "Balanced layout", 832, top + 10, {
      font: "9px 'Trebuchet MS', sans-serif",
      color: topResult ? "#d8cee0" : "rgba(216, 206, 224, 0.7)",
      align: "right",
      baseline: "middle"
    });
    drawText(netLabel, 884, top + 10, {
      font: "700 11px 'Trebuchet MS', sans-serif",
      color: summary.netIncome >= 0 ? "#b8f7aa" : "#ff9a9a",
      align: "right",
      baseline: "middle"
    });
  });
}

function drawSeasonScreen() {
  if (!state.arrivalPhaseResults.cardResults) {
    revealArrivalCardsForPhase(state.currentSeasonPhase);
  }

  drawRoundedRect(34, 48, 892, 454, 28, "rgba(15, 20, 44, 0.9)", "rgba(255, 216, 155, 0.3)", 3);
  drawText("Camping Season", CANVAS_WIDTH / 2, 112, {
    font: "700 42px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });

  const phases = [
    { key: "early", label: "Early Summer", x: 64 },
    { key: "mid", label: "Mid Summer", x: 264 },
    { key: "late", label: "Late Summer", x: 464 }
  ];

  phases.forEach((phase) => {
    const active = state.currentSeasonPhase === phase.key;
    drawRoundedRect(
      phase.x,
      204,
      184,
      38,
      14,
      active ? "rgba(255, 179, 71, 0.28)" : "rgba(255, 248, 231, 0.08)",
      active ? "#ffb347" : "rgba(255, 216, 155, 0.22)",
      2
    );
    drawText(phase.label, phase.x + 92, 224, {
      font: "700 20px 'Trebuchet MS', sans-serif",
      color: active ? "#fff7eb" : "#d8cee0",
      align: "center"
    });
  });

  drawText("Campers Arriving", 332, 278, {
    font: "700 28px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });

  state.arrivalPhaseResults.cardResults.forEach((result, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    drawArrivalCard(result, 54 + col * 204, 296 + row * 102, 188, 94);
  });

  drawArrivalSummary();
  drawSideHustleSummary();
  drawAdjacencySummary();

  registerButton({
    x: 716,
    y: 84,
    w: 170,
    h: 40,
    label: "Next Phase",
    action: "advance-season-phase",
    variant: "primary"
  });

  registerButton({
    x: 716,
    y: 450,
    w: 170,
    h: 42,
    label: "Main Menu",
    action: "menu",
    variant: "secondary"
  });

  if (state.memorialDayOverlay) {
    drawMemorialDayOverlay();
  }

  if (state.laborDayOverlay) {
    drawLaborDayOverlay();
  }

  if (state.exitOverlay) {
    drawExitOverlay();
  }

  if (state.gameOverOverlay) {
    drawGameOverOverlay();
  }
}

function drawPassOverlay() {
  ensureOverlayFocus();
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
    variant: "primary",
    focused: state.focusedButtonAction === "close-pass-overlay"
  });
}

function drawExitOverlay() {
  ensureOverlayFocus();
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
    variant: "secondary",
    focused: state.focusedButtonAction === "close-exit-overlay"
  });

  registerButton({
    x: 514,
    y: 314,
    w: 160,
    h: 44,
    label: "Exit",
    action: "confirm-exit-game",
    variant: "danger",
    focused: state.focusedButtonAction === "confirm-exit-game"
  });
}

function drawPassConfirmOverlay() {
  ensureOverlayFocus();
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
    variant: "secondary",
    focused: state.focusedButtonAction === "close-pass-confirm"
  });

  registerButton({
    x: 514,
    y: 314,
    w: 160,
    h: 44,
    label: "Pass",
    action: "confirm-pass-round",
    variant: "primary",
    focused: state.focusedButtonAction === "confirm-pass-round"
  });
}

function drawLaborDayOverlay() {
  ensureOverlayFocus();
  ctx.fillStyle = "rgba(6, 9, 20, 0.72)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRoundedRect(180, 126, 600, 270, 24, "rgba(15, 20, 44, 0.96)", "rgba(255, 216, 155, 0.35)", 3);
  drawText("Labor Day", CANVAS_WIDTH / 2, 190, {
    font: "700 38px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    "We have now passed Labor Day. Time to switch back to upgrades our parks in the off season.",
    CANVAS_WIDTH / 2,
    232,
    460,
    40,
    {
      font: "26px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );

  registerButton({
    x: 400,
    y: 344,
    w: 160,
    h: 42,
    label: "OK",
    action: "begin-office-season",
    variant: "primary",
    focused: state.focusedButtonAction === "begin-office-season"
  });
}

function drawMemorialDayOverlay() {
  ensureOverlayFocus();
  ctx.fillStyle = "rgba(6, 9, 20, 0.72)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRoundedRect(180, 136, 600, 240, 24, "rgba(15, 20, 44, 0.96)", "rgba(255, 216, 155, 0.35)", 3);
  drawText("Memorial Day", CANVAS_WIDTH / 2, 190, {
    font: "700 38px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawWrappedText(
    "Memorial Day has come! Time to host campers.",
    CANVAS_WIDTH / 2,
    232,
    460,
    36,
    {
      font: "28px 'Trebuchet MS', sans-serif",
      color: "#fff7eb",
      align: "center"
    }
  );

  registerButton({
    x: 400,
    y: 322,
    w: 160,
    h: 42,
    label: "OK",
    action: "close-memorial-day-overlay",
    variant: "primary",
    focused: state.focusedButtonAction === "close-memorial-day-overlay"
  });
}

function drawGameOverOverlay() {
  ensureOverlayFocus();
  ctx.fillStyle = "rgba(6, 9, 20, 0.78)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRoundedRect(180, 90, 600, 340, 24, "rgba(15, 20, 44, 0.97)", "rgba(255, 216, 155, 0.35)", 3);
  drawText("Game Over", CANVAS_WIDTH / 2, 136, {
    font: "700 40px 'Trebuchet MS', sans-serif",
    color: "#ffe6b9",
    align: "center"
  });
  drawText(`${MAX_ROUNDS} years are complete.`, CANVAS_WIDTH / 2, 174, {
    font: "26px 'Trebuchet MS', sans-serif",
    color: "#fff7eb",
    align: "center"
  });

  state.finalStandings.forEach((player, index) => {
    const rowY = 208 + index * 34;
    const topPlayer = index === 0;
    drawRoundedRect(232, rowY, 496, 28, 12, topPlayer ? "rgba(255, 179, 71, 0.18)" : "rgba(255, 248, 231, 0.08)", topPlayer ? "#ffb347" : "rgba(255, 216, 155, 0.15)", 1);
    if (topPlayer) {
      ctx.fillStyle = "#ffcf70";
      ctx.beginPath();
      ctx.moveTo(248, rowY + 18);
      ctx.lineTo(254, rowY + 8);
      ctx.lineTo(260, rowY + 18);
      ctx.lineTo(266, rowY + 6);
      ctx.lineTo(272, rowY + 18);
      ctx.lineTo(278, rowY + 10);
      ctx.lineTo(284, rowY + 18);
      ctx.lineTo(284, rowY + 24);
      ctx.lineTo(248, rowY + 24);
      ctx.closePath();
      ctx.fill();
    }
    drawText(`${player.rank}. ${player.name}`, topPlayer ? 294 : 250, rowY + 18, {
      font: "700 18px 'Trebuchet MS', sans-serif",
      color: topPlayer ? "#ffe6b9" : "#fff7eb",
      baseline: "middle"
    });
    if (topPlayer) {
      drawText("Winner", 560, rowY + 18, {
        font: "700 18px 'Trebuchet MS', sans-serif",
        color: "#ffcf70",
        align: "center",
        baseline: "middle"
      });
    }
    drawText(`$${player.cash}`, 706, rowY + 18, {
      font: "700 18px 'Trebuchet MS', sans-serif",
      color: "#ffe6b9",
      align: "right",
      baseline: "middle"
    });
  });

  registerButton({
    x: 360,
    y: 382,
    w: 240,
    h: 40,
    label: "Return To Main Menu",
    action: "return-to-main-menu",
    variant: "primary",
    focused: state.focusedButtonAction === "return-to-main-menu"
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

  if (state.screen === "season") {
    drawSeasonScreen();
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

  if (!getActiveOverlayConfig()) {
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
  }

  if (button.action === "play") {
    state.screen = "players";
    state.statusMessage = "";
    state.playerSetupFocus = "input";
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

  if (button.action === "advance-season-phase") {
    advanceSeasonPhase();
    return;
  }

  if (button.action === "begin-office-season") {
    beginOfficeSeason();
    return;
  }

  if (button.action === "return-to-main-menu") {
    state.screen = "menu";
    state.statusMessage = "";
    state.selectedPiece = null;
    state.pendingPlacement = null;
    state.passOverlay = null;
    state.passConfirmOverlay = false;
    state.memorialDayOverlay = false;
    state.laborDayOverlay = false;
    state.gameOverOverlay = false;
    state.finalStandings = [];
    state.exitOverlay = false;
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "close-memorial-day-overlay") {
    state.memorialDayOverlay = false;
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "back") {
    state.screen = "menu";
    state.statusMessage = "";
    state.playerSetupFocus = "input";
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
    if (state.screen === "game" || state.screen === "season") {
      state.exitOverlay = true;
      state.focusedButtonAction = "close-exit-overlay";
      state.focusedModalButtonIndex = 0;
      return;
    }

    state.screen = "menu";
    state.statusMessage = "";
    state.selectedPiece = null;
    state.pendingPlacement = null;
    state.passOverlay = null;
    state.passConfirmOverlay = false;
    state.exitOverlay = false;
    state.memorialDayOverlay = false;
    state.laborDayOverlay = false;
    state.gameOverOverlay = false;
    state.finalStandings = [];
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "close-pass-overlay") {
    state.passOverlay = null;
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "pass-round") {
    state.passConfirmOverlay = true;
    state.focusedButtonAction = "close-pass-confirm";
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "close-pass-confirm") {
    state.passConfirmOverlay = false;
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "confirm-pass-round") {
    confirmPassForRound();
    return;
  }

  if (button.action === "close-exit-overlay") {
    state.exitOverlay = false;
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
    return;
  }

  if (button.action === "confirm-exit-game") {
    state.screen = "menu";
    state.statusMessage = "";
    state.selectedPiece = null;
    state.pendingPlacement = null;
    state.passOverlay = null;
    state.passConfirmOverlay = false;
    state.memorialDayOverlay = false;
    state.laborDayOverlay = false;
    state.gameOverOverlay = false;
    state.finalStandings = [];
    state.exitOverlay = false;
    state.focusedButtonAction = null;
    state.focusedModalButtonIndex = 0;
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
      state.playerSetupFocus = "input";
      state.statusMessage = "";
      return;
    }
  }

  const clickedButton = [...state.uiButtons].reverse().find((button) => pointInRect(point.x, point.y, button));
  if (clickedButton) {
    if (getActiveOverlayConfig()) {
      state.focusedButtonAction = clickedButton.action;
      const overlay = getActiveOverlayConfig();
      if (overlay) {
        const actionIndex = overlay.actions.indexOf(clickedButton.action);
        if (actionIndex >= 0) {
          state.focusedModalButtonIndex = actionIndex;
        }
      }
    }
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
      const availableSlots = getAvailablePieceSlots();
      const focusedIndex = availableSlots.findIndex((slot) =>
        slot.groupName === clickedPiece.groupName && slot.slotIndex === clickedPiece.slotIndex
      );
      if (focusedIndex >= 0) {
        state.focusedPieceSlotIndex = focusedIndex;
      }
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

  if (state.screen === "season" && (state.memorialDayOverlay || state.laborDayOverlay || state.gameOverOverlay || state.exitOverlay)) {
    return;
  }
});

function handlePlayerSetupKeydown(event) {
  if (state.screen !== "players") {
    return false;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    if (event.shiftKey) {
      if (state.playerSetupFocus === "start") {
        state.playerSetupFocus = "input";
        state.activeInputIndex = Math.max(0, state.players.length - 1);
      } else {
        state.activeInputIndex =
          (state.activeInputIndex - 1 + state.players.length) % state.players.length;
      }
    } else if (state.playerSetupFocus === "input" && state.activeInputIndex === state.players.length - 1) {
      state.playerSetupFocus = "start";
    } else if (state.playerSetupFocus === "start") {
      state.playerSetupFocus = "input";
      state.activeInputIndex = 0;
    } else {
      state.activeInputIndex = (state.activeInputIndex + 1) % state.players.length;
    }
    return true;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    if (state.playerSetupFocus === "start") {
      startGameFromSetup();
      return;
    }

    const current = (state.players[state.activeInputIndex] || "").trim();
    if (state.activeInputIndex === state.players.length - 1 && current && state.players.length < MAX_PLAYERS) {
      addPlayer();
      return;
    }

    if (state.activeInputIndex < state.players.length - 1) {
      state.activeInputIndex += 1;
    } else {
      state.playerSetupFocus = "start";
    }
    return true;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    const current = state.players[state.activeInputIndex] || "";
    state.players[state.activeInputIndex] = current.slice(0, -1);
    return true;
  }

  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return false;
  }

  const current = state.players[state.activeInputIndex] || "";
  if (current.length >= MAX_NAME_LENGTH) {
    state.statusMessage = "Player names can be up to 24 characters.";
    return true;
  }

  state.playerSetupFocus = "input";
  state.players[state.activeInputIndex] = current + event.key;
  state.statusMessage = "";
  return true;
}

function handleOverlayKeydown(event) {
  const overlay = getActiveOverlayConfig();
  if (!overlay) {
    return false;
  }

  ensureOverlayFocus();

  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    cycleOverlayButtonFocus(-1);
    return true;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    cycleOverlayButtonFocus(1);
    return true;
  }

  if (event.key === "Escape" && overlay.cancelAction) {
    event.preventDefault();
    triggerButtonAction(overlay.cancelAction);
    return true;
  }

  if (event.key === " " || event.key === "Spacebar" || event.key === "Enter") {
    event.preventDefault();
    if (event.repeat) {
      return true;
    }
    triggerButtonAction(getDefaultActionForCurrentOverlay());
    return true;
  }

  return false;
}

function handleGameKeyboard(event) {
  if (state.screen !== "game") {
    return false;
  }

  if (getActiveOverlayConfig()) {
    return false;
  }

  const lowerKey = event.key.toLowerCase();

  if (!state.pendingPlacement && (event.key === "Tab" || event.key === "[" || event.key === "]" || lowerKey === "a" || lowerKey === "d")) {
    event.preventDefault();
    cycleFocusedPieceSlot(event.key === "]" || lowerKey === "d" ? 1 : -1);
    return true;
  }

  if (!state.pendingPlacement && (event.key === " " || event.key === "Spacebar" || event.key === "Enter")) {
    event.preventDefault();
    return selectFocusedPieceSlot();
  }

  if (event.key === "ArrowUp") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("move-up");
    return true;
  }

  if (event.key === "ArrowLeft") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("move-left");
    return true;
  }

  if (event.key === "ArrowDown") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("move-down");
    return true;
  }

  if (event.key === "ArrowRight") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("move-right");
    return true;
  }

  if (lowerKey === "q") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("rotate-left");
    return true;
  }

  if (lowerKey === "e") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("rotate-right");
    return true;
  }

  if (lowerKey === "f") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("flip-piece");
    return true;
  }

  if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("confirm-placement");
    return true;
  }

  if (event.key === "Escape" || event.key === "Backspace" || event.key === "Delete") {
    if (!state.pendingPlacement) {
      return false;
    }
    event.preventDefault();
    triggerButtonAction("cancel-placement");
    return true;
  }

  return false;
}

function handleGlobalKeydown(event) {
  if (handlePlayerSetupKeydown(event)) {
    return;
  }

  if (handleOverlayKeydown(event)) {
    return;
  }

  handleGameKeyboard(event);
}

window.addEventListener("keydown", handleGlobalKeydown);

function frame(now) {
  state.time = now / 1000;
  draw();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
