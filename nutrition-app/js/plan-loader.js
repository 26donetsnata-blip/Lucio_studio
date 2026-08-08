// Определяет, какие блюда относятся к конкретной календарной дате,
// с учётом цикла плана и выбранных пользователем замен.

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

function isoWeekday(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  const day = d.getDay(); // 0=Вс..6=Сб
  return day === 0 ? 7 : day; // 1=Пн..7=Вс
}

function dayIndexInPlan(isoDate) {
  const start = new Date(PROFILE.planStartDate + "T00:00:00");
  const current = new Date(isoDate + "T00:00:00");
  const diffMs = current - start;
  return Math.round(diffMs / 86400000); // 0-based, может быть отрицательным/за пределами плана
}

function cycleDayForDate(isoDate) {
  const idx = dayIndexInPlan(isoDate);
  const cycleLen = MEAL_PLAN.cycleLengthDays;
  const mod = ((idx % cycleLen) + cycleLen) % cycleLen;
  return MEAL_PLAN.days[mod];
}

function isWithinPlan(isoDate) {
  const idx = dayIndexInPlan(isoDate);
  return idx >= 0 && idx < PROFILE.totalPlanDays;
}

function isTrainingDay(isoDate) {
  return PROFILE.activity.strengthTrainingDaysOfWeek.includes(isoWeekday(isoDate));
}

// Возвращает объект блюда (primary или выбранную альтернативу) для даты+слота.
function getMealForDate(isoDate, slot) {
  const cycleDay = cycleDayForDate(isoDate);
  const primary = cycleDay.meals[slot];
  const selectedId = getMealSelection(isoDate, slot);
  if (selectedId && selectedId !== primary.id) {
    const alt = MEAL_PLAN.alternatives[slot].find((m) => m.id === selectedId);
    if (alt) return alt;
  }
  return primary;
}

function getAllMealsForDate(isoDate) {
  return MEAL_PLAN.mealSlots.map((slot) => ({ slot, meal: getMealForDate(isoDate, slot) }));
}

function getDayTotals(isoDate) {
  const meals = getAllMealsForDate(isoDate);
  let kcal = 0, proteinG = 0, fatG = 0, carbG = 0;
  meals.forEach(({ meal }) => {
    kcal += meal.kcal;
    proteinG += meal.macros.proteinG;
    fatG += meal.macros.fatG;
    carbG += meal.macros.carbG;
  });
  if (isTrainingDay(isoDate)) {
    const bonus = MEAL_PLAN.workoutBonus;
    kcal += bonus.kcal;
    proteinG += bonus.macros.proteinG;
    fatG += bonus.macros.fatG;
    carbG += bonus.macros.carbG;
  }
  getCustomEntries(isoDate).forEach((entry) => {
    kcal += entry.kcal;
    proteinG += entry.macros.proteinG;
    fatG += entry.macros.fatG;
    carbG += entry.macros.carbG;
  });
  return { kcal, proteinG, fatG, carbG };
}
