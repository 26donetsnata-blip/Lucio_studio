// Формирует список покупок на 7 дней, начиная с заданной даты.

function getWeekDates(weekStartIso) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(toISODate(addDays(weekStartIso, i)));
  }
  return dates;
}

function buildShoppingList(weekStartIso) {
  const dates = getWeekDates(weekStartIso);
  const map = new Map();

  function addIngredients(ingredients) {
    ingredients.forEach(({ name, amount, unit, shoppingCategory }) => {
      const key = `${name.toLowerCase().trim()}|${unit}`;
      if (!map.has(key)) {
        map.set(key, { name, unit, amount: 0, shoppingCategory: shoppingCategory || "прочее" });
      }
      map.get(key).amount += amount;
    });
  }

  dates.forEach((isoDate) => {
    getAllMealsForDate(isoDate).forEach(({ meal }) => addIngredients(meal.ingredients));
    if (isTrainingDay(isoDate)) {
      addIngredients(MEAL_PLAN.workoutBonus.ingredients);
    }
  });

  const items = Array.from(map.entries()).map(([key, value]) => ({ key, ...value }));
  items.sort((a, b) => a.shoppingCategory.localeCompare(b.shoppingCategory, "ru") || a.name.localeCompare(b.name, "ru"));

  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.shoppingCategory]) grouped[item.shoppingCategory] = [];
    grouped[item.shoppingCategory].push(item);
  });

  return grouped;
}
