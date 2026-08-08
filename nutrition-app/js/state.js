// Хранение отметок о выполнении в localStorage. Переживает перезагрузку страницы.

const STORAGE_KEY = "nutritionAppState";
const SCHEMA_VERSION = 2;

function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    completions: {},
    mealSelections: {},
    shoppingListChecks: {},
    customEntries: {}
  };
}

// Аккуратно донастраивает старые сохранённые данные до текущей схемы,
// не стирая прогресс пользователя.
function migrateState(parsed) {
  if (parsed.schemaVersion === 1) {
    parsed.customEntries = parsed.customEntries || {};
    parsed.schemaVersion = 2;
  }
  return parsed;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    let parsed = JSON.parse(raw);
    if (parsed.schemaVersion < SCHEMA_VERSION) parsed = migrateState(parsed);
    if (parsed.schemaVersion !== SCHEMA_VERSION) return defaultState();
    return parsed;
  } catch (e) {
    console.warn("localStorage недоступен, прогресс не будет сохраняться между сессиями.", e);
    return defaultState();
  }
}

let state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Не удалось сохранить прогресс в localStorage.", e);
  }
}

function ensureDay(date) {
  if (!state.completions[date]) {
    state.completions[date] = { meals: {}, workoutDone: false, lymphaticDone: false };
  }
  return state.completions[date];
}

function setMealDone(date, slot, done) {
  ensureDay(date).meals[slot] = done;
  saveState();
}

function isMealDone(date, slot) {
  return !!(state.completions[date] && state.completions[date].meals[slot]);
}

function setWorkoutDone(date, done) {
  ensureDay(date).workoutDone = done;
  saveState();
}

function isWorkoutDone(date) {
  return !!(state.completions[date] && state.completions[date].workoutDone);
}

function setLymphaticDone(date, done) {
  ensureDay(date).lymphaticDone = done;
  saveState();
}

function isLymphaticDone(date) {
  return !!(state.completions[date] && state.completions[date].lymphaticDone);
}

function setMealSelection(date, slot, mealId) {
  if (!state.mealSelections[date]) state.mealSelections[date] = {};
  if (mealId) {
    state.mealSelections[date][slot] = mealId;
  } else {
    delete state.mealSelections[date][slot];
  }
  saveState();
}

function getMealSelection(date, slot) {
  return state.mealSelections[date] && state.mealSelections[date][slot];
}

function toggleShoppingItem(weekStart, key) {
  if (!state.shoppingListChecks[weekStart]) state.shoppingListChecks[weekStart] = {};
  state.shoppingListChecks[weekStart][key] = !state.shoppingListChecks[weekStart][key];
  saveState();
  return state.shoppingListChecks[weekStart][key];
}

function isShoppingItemChecked(weekStart, key) {
  return !!(state.shoppingListChecks[weekStart] && state.shoppingListChecks[weekStart][key]);
}

// ---------- Свои записи (еда не из плана) ----------

function addCustomEntry(date, entry) {
  if (!state.customEntries[date]) state.customEntries[date] = [];
  const record = {
    id: `custom-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    name: entry.name,
    kcal: entry.kcal,
    macros: { proteinG: entry.proteinG, fatG: entry.fatG, carbG: entry.carbG }
  };
  state.customEntries[date].push(record);
  saveState();
  return record;
}

function removeCustomEntry(date, id) {
  if (!state.customEntries[date]) return;
  state.customEntries[date] = state.customEntries[date].filter((e) => e.id !== id);
  saveState();
}

function getCustomEntries(date) {
  return (state.customEntries[date] || []).slice();
}

function getState() {
  return state;
}
