// Расчёт целевой калорийности и БЖУ по формуле Миффлина-Сан Жеора.

function calcBMR(profile) {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;
  return profile.gender === "female" ? base - 161 : base + 5;
}

function calcTDEE(profile) {
  const bmr = calcBMR(profile);
  // Лёгкая активность: 1 силовая тренировка в неделю + ежедневная лёгкая зарядка.
  const activityMultiplier = 1.375;
  return bmr * activityMultiplier;
}

function calcTargetCalories(profile) {
  const tdee = calcTDEE(profile);
  // Дефицit ~500 ккал/день для снижения веса ~0.5 кг/неделю, не ниже безопасного минимума.
  const target = tdee - 500;
  return Math.round(Math.max(target, 1300));
}

function calcMacros(targetCalories) {
  const proteinG = Math.round((targetCalories * 0.3) / 4);
  const fatG = Math.round((targetCalories * 0.3) / 9);
  const carbG = Math.round((targetCalories * 0.4) / 4);
  return { proteinG, fatG, carbG };
}

function getNutritionSummary(profile) {
  const bmr = Math.round(calcBMR(profile));
  const tdee = Math.round(calcTDEE(profile));
  const targetCalories = calcTargetCalories(profile);
  const macros = calcMacros(targetCalories);
  return { bmr, tdee, targetCalories, macros };
}
