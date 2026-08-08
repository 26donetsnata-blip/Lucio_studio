// Главный модуль: переключение экранов и рендеринг.

const SLOT_LABELS = { breakfast: "Завтрак", lunch: "Обед", snack: "Перекус", dinner: "Ужин" };

let currentDate = toISODate(new Date());
let currentWeekStart = getWeekStartIso(currentDate);

function getWeekStartIso(isoDate) {
  const wd = isoWeekday(isoDate); // 1..7, Пн=1
  return toISODate(addDays(isoDate, -(wd - 1)));
}

function formatDateHuman(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" });
}

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function switchView(viewName) {
  qsa(".view").forEach((v) => v.hidden = v.dataset.view !== viewName);
  qsa(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.view === viewName));
  if (viewName === "today") renderToday();
  if (viewName === "week") renderWeek();
  if (viewName === "shopping") renderShopping();
  if (viewName === "progress") renderProgress();
  if (viewName === "profile") renderProfile();
  history.replaceState(null, "", `#${viewName}`);
}

// ---------- Сегодня ----------
function renderToday() {
  qs("#today-date").textContent = formatDateHuman(currentDate);
  const container = qs("#today-meals");
  container.innerHTML = "";

  getAllMealsForDate(currentDate).forEach(({ slot, meal }) => {
    container.appendChild(buildMealCard(slot, meal));
  });

  renderCustomEntries();

  const trainDayBox = qs("#training-day-box");
  if (isTrainingDay(currentDate)) {
    trainDayBox.hidden = false;
    const bonus = MEAL_PLAN.workoutBonus;
    qs("#training-day-box .bonus-name").textContent = bonus.name;
    qs("#training-day-box .bonus-note").textContent = bonus.note;
    qs("#training-day-box .bonus-kcal").textContent = `${bonus.kcal} ккал`;
    const cb = qs("#workout-checkbox");
    cb.checked = isWorkoutDone(currentDate);
    cb.onchange = () => setWorkoutDone(currentDate, cb.checked);
  } else {
    trainDayBox.hidden = true;
  }

  const lymphCb = qs("#lymphatic-checkbox");
  lymphCb.checked = isLymphaticDone(currentDate);
  lymphCb.onchange = () => setLymphaticDone(currentDate, lymphCb.checked);

  const totals = getDayTotals(currentDate);
  qs("#today-totals").textContent = `Итого: ${totals.kcal} ккал · Б${totals.proteinG} Ж${totals.fatG} У${totals.carbG}`;
}

function buildMealCard(slot, meal) {
  const card = document.createElement("div");
  card.className = "meal-card";
  const done = isMealDone(currentDate, slot);
  card.innerHTML = `
    <div class="meal-card-header">
      <label class="checkbox-row">
        <input type="checkbox" ${done ? "checked" : ""} class="meal-done-checkbox" />
        <span class="slot-label">${SLOT_LABELS[slot]}</span>
      </label>
      <span class="meal-kcal">${meal.kcal} ккал</span>
    </div>
    <div class="meal-name">${meal.name}</div>
    <div class="meal-actions">
      <button type="button" class="link-btn detail-btn">Подробнее / заменить</button>
    </div>
  `;
  card.querySelector(".meal-done-checkbox").addEventListener("change", (e) => {
    setMealDone(currentDate, slot, e.target.checked);
  });
  card.querySelector(".detail-btn").addEventListener("click", () => openMealModal(currentDate, slot));
  return card;
}

document.addEventListener("DOMContentLoaded", () => {
  qs("#today-prev").addEventListener("click", () => { currentDate = toISODate(addDays(currentDate, -1)); renderToday(); });
  qs("#today-next").addEventListener("click", () => { currentDate = toISODate(addDays(currentDate, 1)); renderToday(); });
});

// ---------- Свои записи (еда не из плана) ----------

function renderCustomEntries() {
  const container = qs("#custom-entries");
  const entries = getCustomEntries(currentDate);
  container.innerHTML = "";
  entries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "meal-card custom-entry";
    row.innerHTML = `
      <div class="meal-card-header">
        <span class="slot-label">Своя запись</span>
        <span class="meal-kcal">${entry.kcal} ккал</span>
      </div>
      <div class="meal-name">${entry.name}</div>
      <div class="custom-macros mono">Б${entry.macros.proteinG} Ж${entry.macros.fatG} У${entry.macros.carbG}</div>
      <div class="meal-actions">
        <button type="button" class="link-btn remove-custom-btn">Удалить</button>
      </div>
    `;
    row.querySelector(".remove-custom-btn").addEventListener("click", () => {
      removeCustomEntry(currentDate, entry.id);
      renderToday();
    });
    container.appendChild(row);
  });
}

let customManualMode = false;

function openCustomEntryModal() {
  qs("#custom-form").reset();
  customManualMode = false;
  qs("#custom-manual-fields").hidden = true;
  qs("#custom-manual-toggle").textContent = "Продукта нет в списке — ввести калории/БЖУ вручную";
  qs("#custom-preview").hidden = true;
  qs("#custom-match-status").textContent = "";
  qs("#custom-modal").hidden = false;
  qs("#custom-name").focus();
}

// Пересчитывает предпросмотр калорий/БЖУ по названию продукта и весу.
function updateCustomPreview() {
  if (customManualMode) return;
  const name = qs("#custom-name").value;
  const grams = Number(qs("#custom-grams").value);
  const food = findFood(name);
  const preview = qs("#custom-preview");
  const status = qs("#custom-match-status");

  if (!name.trim()) {
    status.textContent = "";
    preview.hidden = true;
    return;
  }
  if (!food) {
    status.textContent = "Продукт не найден в базе — нажмите «ввести вручную» ниже.";
    preview.hidden = true;
    return;
  }
  status.textContent = `Найдено: ${food.name} (${food.kcal} ккал на 100 г)`;
  if (!grams || grams <= 0) {
    preview.hidden = true;
    return;
  }
  const computed = computeFoodByGrams(food, grams);
  preview.hidden = false;
  preview.querySelector(".preview-kcal").textContent = `≈ ${computed.kcal} ккал`;
  preview.querySelector(".preview-macros").textContent = `Б${computed.proteinG} Ж${computed.fatG} У${computed.carbG}`;
}

document.addEventListener("DOMContentLoaded", () => {
  qs("#add-custom-btn").addEventListener("click", openCustomEntryModal);
  qs("#custom-modal-close").addEventListener("click", () => { qs("#custom-modal").hidden = true; });
  qs("#custom-modal").addEventListener("click", (e) => { if (e.target.id === "custom-modal") qs("#custom-modal").hidden = true; });

  const datalist = qs("#food-datalist");
  datalist.innerHTML = FOOD_DATABASE.map((f) => `<option value="${f.name}"></option>`).join("");

  qs("#custom-name").addEventListener("input", updateCustomPreview);
  qs("#custom-grams").addEventListener("input", updateCustomPreview);

  qs("#custom-manual-toggle").addEventListener("click", () => {
    customManualMode = !customManualMode;
    qs("#custom-manual-fields").hidden = !customManualMode;
    qs("#custom-manual-toggle").textContent = customManualMode
      ? "Вернуться к подсчёту по весу"
      : "Продукта нет в списке — ввести калории/БЖУ вручную";
    qs("#custom-preview").hidden = true;
    qs("#custom-match-status").textContent = "";
  });

  qs("#custom-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = qs("#custom-name").value.trim();
    if (!name) return;

    if (customManualMode) {
      const proteinG = Number(qs("#custom-protein").value) || 0;
      const fatG = Number(qs("#custom-fat").value) || 0;
      const carbG = Number(qs("#custom-carb").value) || 0;
      const kcal = Number(qs("#custom-kcal").value) || Math.round(proteinG * 4 + fatG * 9 + carbG * 4);
      if (kcal <= 0) return;
      addCustomEntry(currentDate, { name, kcal, proteinG, fatG, carbG });
    } else {
      const grams = Number(qs("#custom-grams").value);
      const food = findFood(name);
      if (!food || !grams || grams <= 0) return;
      const computed = computeFoodByGrams(food, grams);
      addCustomEntry(currentDate, { name: `${name} (${grams} г)`, ...computed });
    }

    qs("#custom-modal").hidden = true;
    renderToday();
  });

  // Автоподсчёт калорий из БЖУ в ручном режиме.
  qs("#custom-autofill-btn").addEventListener("click", () => {
    const proteinG = Number(qs("#custom-protein").value) || 0;
    const fatG = Number(qs("#custom-fat").value) || 0;
    const carbG = Number(qs("#custom-carb").value) || 0;
    qs("#custom-kcal").value = Math.round(proteinG * 4 + fatG * 9 + carbG * 4);
  });
});

// ---------- Неделя ----------
function renderWeek() {
  const container = qs("#week-days");
  container.innerHTML = "";
  qs("#week-range").textContent = `${formatDateHuman(currentWeekStart)} — ${formatDateHuman(toISODate(addDays(currentWeekStart, 6)))}`;

  getWeekDates(currentWeekStart).forEach((isoDate) => {
    const dayBox = document.createElement("div");
    dayBox.className = "week-day";
    const meals = getAllMealsForDate(isoDate);
    const doneCount = meals.filter(({ slot }) => isMealDone(isoDate, slot)).length;
    const pct = Math.round((doneCount / meals.length) * 100);
    dayBox.innerHTML = `
      <div class="week-day-header">
        <span>${formatDateHuman(isoDate)}</span>
        <span>${doneCount}/${meals.length}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    `;
    dayBox.addEventListener("click", () => { currentDate = isoDate; switchView("today"); });
    container.appendChild(dayBox);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  qs("#week-prev").addEventListener("click", () => { currentWeekStart = toISODate(addDays(currentWeekStart, -7)); renderWeek(); });
  qs("#week-next").addEventListener("click", () => { currentWeekStart = toISODate(addDays(currentWeekStart, 7)); renderWeek(); });
});

// ---------- Список покупок ----------
function renderShopping() {
  qs("#shopping-range").textContent = `${formatDateHuman(currentWeekStart)} — ${formatDateHuman(toISODate(addDays(currentWeekStart, 6)))}`;
  const grouped = buildShoppingList(currentWeekStart);
  const container = qs("#shopping-list");
  container.innerHTML = "";

  Object.keys(grouped).forEach((category) => {
    const section = document.createElement("div");
    section.className = "shopping-category";
    const title = document.createElement("h3");
    title.textContent = category;
    section.appendChild(title);
    grouped[category].forEach((item) => {
      const row = document.createElement("label");
      row.className = "checkbox-row shopping-item";
      const checked = isShoppingItemChecked(currentWeekStart, item.key);
      row.innerHTML = `<input type="checkbox" ${checked ? "checked" : ""} /> <span>${item.name} — ${Math.round(item.amount)} ${item.unit}</span>`;
      row.querySelector("input").addEventListener("change", () => toggleShoppingItem(currentWeekStart, item.key));
      section.appendChild(row);
    });
    container.appendChild(section);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  qs("#shopping-prev").addEventListener("click", () => { currentWeekStart = toISODate(addDays(currentWeekStart, -7)); renderShopping(); });
  qs("#shopping-next").addEventListener("click", () => { currentWeekStart = toISODate(addDays(currentWeekStart, 7)); renderShopping(); });
});

// ---------- Прогресс ----------
function renderProgress() {
  const dayMeals = getAllMealsForDate(currentDate);
  const dayDone = dayMeals.filter(({ slot }) => isMealDone(currentDate, slot)).length;
  qs("#progress-day").textContent = `${Math.round((dayDone / dayMeals.length) * 100)}%`;

  const weekDates = getWeekDates(currentWeekStart);
  let weekTotal = 0, weekDone = 0;
  weekDates.forEach((isoDate) => {
    const meals = getAllMealsForDate(isoDate);
    weekTotal += meals.length + 1; // +1 за лимфодренаж
    weekDone += meals.filter(({ slot }) => isMealDone(isoDate, slot)).length;
    if (isLymphaticDone(isoDate)) weekDone += 1;
  });
  qs("#progress-week").textContent = `${Math.round((weekDone / weekTotal) * 100)}%`;

  let monthTotal = 0, monthDone = 0;
  for (let i = 0; i < PROFILE.totalPlanDays; i++) {
    const isoDate = toISODate(addDays(PROFILE.planStartDate, i));
    const meals = getAllMealsForDate(isoDate);
    monthTotal += meals.length + 1;
    monthDone += meals.filter(({ slot }) => isMealDone(isoDate, slot)).length;
    if (isLymphaticDone(isoDate)) monthDone += 1;
  }
  qs("#progress-month").textContent = `${Math.round((monthDone / monthTotal) * 100)}%`;
}

// ---------- Профиль ----------
function renderProfile() {
  const summary = getNutritionSummary(PROFILE);
  qs("#profile-info").innerHTML = `
    <p>Возраст: ${PROFILE.age} лет, рост: ${PROFILE.heightCm} см, вес: ${PROFILE.weightKg} кг</p>
    <p>Цель: ${PROFILE.goalWeightDeltaKg} кг</p>
    <p>Базовый обмен (BMR): ~${summary.bmr} ккал</p>
    <p>Расход с активностью (TDEE): ~${summary.tdee} ккал</p>
    <p><strong>Целевая калорийность: ~${summary.targetCalories} ккал/день</strong></p>
    <p>БЖУ: белки ${summary.macros.proteinG} г · жиры ${summary.macros.fatG} г · углеводы ${summary.macros.carbG} г</p>
    <p class="hint">Эти цифры ориентировочные. Перед началом плана рекомендуется консультация врача/диетолога.</p>
  `;
}

// ---------- Модальное окно блюда ----------
function openMealModal(isoDate, slot) {
  const modal = qs("#meal-modal");
  const primary = cycleDayForDate(isoDate).meals[slot];
  const selectedId = getMealSelection(isoDate, slot) || primary.id;
  const currentMeal = getMealForDate(isoDate, slot);

  qs("#modal-slot-label").textContent = SLOT_LABELS[slot];
  qs("#modal-meal-name").textContent = currentMeal.name;
  qs("#modal-meal-kcal").textContent = `${currentMeal.kcal} ккал · Б${currentMeal.macros.proteinG} Ж${currentMeal.macros.fatG} У${currentMeal.macros.carbG} · ${currentMeal.prepTimeMin} мин`;

  const ingList = qs("#modal-ingredients");
  ingList.innerHTML = currentMeal.ingredients.map((i) => `<li>${i.name} — ${i.amount} ${i.unit}</li>`).join("");

  const stepsList = qs("#modal-steps");
  stepsList.innerHTML = currentMeal.steps.map((s) => `<li>${s}</li>`).join("");

  const altContainer = qs("#modal-alternatives");
  altContainer.innerHTML = "";
  const allOptions = [primary, ...MEAL_PLAN.alternatives[slot]];
  allOptions.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "alt-chip" + (option.id === selectedId ? " active" : "");
    btn.textContent = option.name;
    btn.addEventListener("click", () => {
      setMealSelection(isoDate, slot, option.id === primary.id ? null : option.id);
      openMealModal(isoDate, slot);
      if (!qs("#today-meals").hidden) renderToday();
    });
    altContainer.appendChild(btn);
  });

  modal.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  qs("#modal-close").addEventListener("click", () => { qs("#meal-modal").hidden = true; });
  qs("#meal-modal").addEventListener("click", (e) => { if (e.target.id === "meal-modal") qs("#meal-modal").hidden = true; });

  qsa(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  const initialView = (location.hash || "#today").slice(1);
  switchView(["today", "week", "shopping", "progress", "profile"].includes(initialView) ? initialView : "today");
});
