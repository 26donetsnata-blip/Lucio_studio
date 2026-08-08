// База продуктов (значения на 100 г) для расчёта калорий/БЖУ по введённому весу.
// Значения — усреднённые по стандартным таблицам состава продуктов.

const FOOD_DATABASE = [
  { name: "Овсяные хлопья", kcal: 342, proteinG: 12, fatG: 6, carbG: 58 },
  { name: "Гречка", kcal: 313, proteinG: 12.6, fatG: 3.3, carbG: 62 },
  { name: "Рис", kcal: 344, proteinG: 6.7, fatG: 0.7, carbG: 78.9 },
  { name: "Булгур", kcal: 342, proteinG: 12.3, fatG: 1.3, carbG: 67.7 },
  { name: "Чечевица", kcal: 295, proteinG: 24, fatG: 1.1, carbG: 46.3 },
  { name: "Макароны", kcal: 337, proteinG: 10.4, fatG: 1.1, carbG: 69.7 },
  { name: "Гранола / мюсли без сахара", kcal: 370, proteinG: 10, fatG: 8, carbG: 65 },
  { name: "Творог 5%", kcal: 121, proteinG: 17.2, fatG: 5, carbG: 1.8 },
  { name: "Творог 2%", kcal: 103, proteinG: 18, fatG: 2, carbG: 3.3 },
  { name: "Творог 9%", kcal: 159, proteinG: 16.7, fatG: 9, carbG: 2 },
  { name: "Кефир 1%", kcal: 40, proteinG: 3, fatG: 1, carbG: 4 },
  { name: "Молоко 1.5%", kcal: 44, proteinG: 2.8, fatG: 1.5, carbG: 4.7 },
  { name: "Йогурт натуральный", kcal: 66, proteinG: 5, fatG: 3.2, carbG: 3.5 },
  { name: "Сметана 15%", kcal: 158, proteinG: 2.6, fatG: 15, carbG: 3 },
  { name: "Сыр твёрдый", kcal: 350, proteinG: 26, fatG: 27, carbG: 0 },
  { name: "Сыр нежирный", kcal: 226, proteinG: 20, fatG: 17, carbG: 0 },
  { name: "Яйцо куриное", kcal: 157, proteinG: 12.7, fatG: 10.9, carbG: 0.7 },
  { name: "Куриная грудка", kcal: 113, proteinG: 23.6, fatG: 1.9, carbG: 0.4 },
  { name: "Филе индейки", kcal: 104, proteinG: 24, fatG: 0.7, carbG: 0 },
  { name: "Фарш куриный", kcal: 143, proteinG: 17.4, fatG: 8.1, carbG: 0.5 },
  { name: "Минтай / хек (рыба)", kcal: 72, proteinG: 15.9, fatG: 0.9, carbG: 0 },
  { name: "Колбаса варёная", kcal: 257, proteinG: 12, fatG: 22.8, carbG: 1.5 },
  { name: "Сосиски", kcal: 266, proteinG: 12.3, fatG: 23.9, carbG: 1.5 },
  { name: "Банан", kcal: 96, proteinG: 1.5, fatG: 0.5, carbG: 21 },
  { name: "Яблоко", kcal: 47, proteinG: 0.4, fatG: 0.4, carbG: 9.8 },
  { name: "Апельсин", kcal: 43, proteinG: 0.9, fatG: 0.2, carbG: 8.1 },
  { name: "Ягоды замороженные", kcal: 45, proteinG: 0.8, fatG: 0.3, carbG: 9.5 },
  { name: "Изюм", kcal: 299, proteinG: 2.9, fatG: 0.6, carbG: 74 },
  { name: "Финики", kcal: 292, proteinG: 2.5, fatG: 0.4, carbG: 69.2 },
  { name: "Огурец", kcal: 15, proteinG: 0.8, fatG: 0.1, carbG: 2.8 },
  { name: "Помидор", kcal: 20, proteinG: 1.1, fatG: 0.2, carbG: 3.9 },
  { name: "Капуста белокочанная", kcal: 27, proteinG: 1.8, fatG: 0.1, carbG: 4.7 },
  { name: "Морковь", kcal: 32, proteinG: 1.3, fatG: 0.1, carbG: 6.9 },
  { name: "Свёкла", kcal: 40, proteinG: 1.5, fatG: 0.1, carbG: 8.8 },
  { name: "Кабачок", kcal: 24, proteinG: 0.6, fatG: 0.3, carbG: 4.6 },
  { name: "Баклажан", kcal: 24, proteinG: 1.2, fatG: 0.1, carbG: 4.5 },
  { name: "Картофель", kcal: 77, proteinG: 2, fatG: 0.4, carbG: 16.3 },
  { name: "Лук репчатый", kcal: 41, proteinG: 1.4, fatG: 0.2, carbG: 8.2 },
  { name: "Шампиньоны", kcal: 27, proteinG: 4.3, fatG: 1, carbG: 0.1 },
  { name: "Грецкий орех", kcal: 654, proteinG: 15.2, fatG: 65.2, carbG: 13.7 },
  { name: "Миндаль", kcal: 579, proteinG: 21, fatG: 49.9, carbG: 21.6 },
  { name: "Кешью", kcal: 553, proteinG: 18.2, fatG: 43.9, carbG: 30.2 },
  { name: "Семена льна", kcal: 534, proteinG: 18.3, fatG: 42.2, carbG: 28.9 },
  { name: "Хлеб цельнозерновой", kcal: 250, proteinG: 9, fatG: 3.5, carbG: 45 },
  { name: "Хлеб белый", kcal: 265, proteinG: 7.7, fatG: 2.4, carbG: 53 },
  { name: "Хлебцы цельнозерновые", kcal: 310, proteinG: 10, fatG: 2, carbG: 60 },
  { name: "Мёд", kcal: 304, proteinG: 0.3, fatG: 0, carbG: 76.8 },
  { name: "Сахар", kcal: 398, proteinG: 0, fatG: 0, carbG: 99.8 },
  { name: "Масло растительное", kcal: 899, proteinG: 0, fatG: 99.9, carbG: 0 },
  { name: "Масло сливочное", kcal: 748, proteinG: 0.5, fatG: 82.5, carbG: 0.8 },
  { name: "Майонез", kcal: 627, proteinG: 1.8, fatG: 67, carbG: 2.6 },
  { name: "Пицца", kcal: 266, proteinG: 11, fatG: 10, carbG: 33 },
  { name: "Бургер", kcal: 265, proteinG: 13, fatG: 13, carbG: 28 },
  { name: "Картофель фри", kcal: 312, proteinG: 3.4, fatG: 15, carbG: 41 },
  { name: "Пельмени", kcal: 275, proteinG: 12, fatG: 14, carbG: 25 },
  { name: "Чипсы картофельные", kcal: 536, proteinG: 6.6, fatG: 35, carbG: 53 },
  { name: "Печенье песочное", kcal: 468, proteinG: 7.5, fatG: 18, carbG: 68 },
  { name: "Шоколад молочный", kcal: 534, proteinG: 7.7, fatG: 29.7, carbG: 59.4 },
  { name: "Шоколад тёмный 70%", kcal: 546, proteinG: 7.8, fatG: 38, carbG: 45.9 },
  { name: "Мороженое пломбир", kcal: 227, proteinG: 3.7, fatG: 15, carbG: 20.8 },
  { name: "Вино красное сухое", kcal: 68, proteinG: 0.2, fatG: 0, carbG: 0.3 },
  { name: "Пиво светлое", kcal: 42, proteinG: 0.5, fatG: 0, carbG: 3.6 }
];

// Ищет продукт по названию: сначала точное совпадение, затем частичное.
function findFood(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const exact = FOOD_DATABASE.find((f) => f.name.toLowerCase() === q);
  if (exact) return exact;
  const partial = FOOD_DATABASE.find(
    (f) => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase())
  );
  return partial || null;
}

// Считает калории/БЖУ для заданного веса продукта в граммах.
function computeFoodByGrams(food, grams) {
  const factor = grams / 100;
  return {
    kcal: Math.round(food.kcal * factor),
    proteinG: Math.round(food.proteinG * factor * 10) / 10,
    fatG: Math.round(food.fatG * factor * 10) / 10,
    carbG: Math.round(food.carbG * factor * 10) / 10
  };
}
